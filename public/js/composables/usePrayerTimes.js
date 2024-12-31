const { ref, computed, onMounted, onBeforeUnmount } = Vue;
import prayerDB from "../prayerDB.js";

export const usePrayerTimes = () => {
	// State
	const filteredPrayersByIsland = ref([]);
	const selectedIsland = ref("");
	const categoryId = ref("");
	const todaysPrayers = ref({});
	const skipNextPrayerCalculationAndShowFajr = ref(false);
	const showSettings = ref(false);
	const todayDate = ref(new Date());
	const timeDifference = ref({ hours: 0, minutes: 0 });
	let countdownInterval = null;

	const getCurrentTime = computed(() => {
		return todayDate.value.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false, // Ensure 24-hour format for consistent comparison
		});
	});

	// Constants
	const PRAYER_NAMES = {
		f: "Fajr",
		d: "Dhuhr",
		a: "Asr",
		m: "Maghrib",
		i: "Isha",
	};

	const DEFAULT_SETTINGS = {
		atoll: "Gnaviyani",
		island: {
			categoryId: "81",
			island: "Fuvahmulah City",
			atoll: "Gnaviyani",
		},
	};

	const dayOfYear = computed(() => {
		const start = new Date(todayDate.value.getFullYear(), 0, 0);
		const diff = todayDate.value - start;
		const oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	});

	// Helper function to parse time string
	const parseTime = (timeStr) => {
		const [hours, minutes] = timeStr.split(":").map(Number);
		return hours * 60 + minutes;
	};

	// Helper function to update time difference (extracted for clarity)
	const updateDiff = (currentTime, nextPrayerTime) => {
		if (!nextPrayerTime) {
			timeDifference.value = { hours: 0, minutes: 0 };
			return;
		}

		const currentMinutes = parseTime(currentTime);
		const nextMinutes = parseTime(nextPrayerTime);

		let diffMinutes = nextMinutes - currentMinutes;

		// Handle next day case
		if (diffMinutes < 0) {
			diffMinutes += 24 * 60;
		}

		timeDifference.value = {
			hours: Math.floor(diffMinutes / 60),
			minutes: diffMinutes % 60,
		};
	};

	// Load island data (improved with memoization)
	const loadIslandData = () => {
		try {
			const loadedIsland = JSON.parse(
				localStorage.getItem("island") || DEFAULT_SETTINGS.island
			);

			selectedIsland.value = loadedIsland.island;
			categoryId.value = loadedIsland.categoryId;

			// Memoized logic using a closure
			const filteredData = (() => {
				const filtered = prayerDB.filter(
					(item) => Number(item.cat) === Number(categoryId.value)
				);
				if (filtered.length === 0) {
					throw new Error("No prayer data found for selected island");
				}
				return filtered;
			})();

			filteredPrayersByIsland.value = filteredData;
			todaysPrayers.value = filteredData[0].prayers[dayOfYear.value] || {};
		} catch (error) {
			console.error("Error loading island data:", error);
			// Reset to defaults and retry
			localStorage.setItem("atoll", DEFAULT_SETTINGS.atoll);
			localStorage.setItem("island", JSON.stringify(DEFAULT_SETTINGS.island));
			loadIslandData();
		}
	};

	const calculateNextPrayer = () => {
		const currentTime = getCurrentTime.value;
		const currentTimeMinutes = parseTime(currentTime);

		// Filter out sunrise and create ordered prayer times
		const prayerTimes = Object.entries(todaysPrayers.value || {})
			.filter(([key]) => key !== "s")
			.sort((a, b) => parseTime(a[1]) - parseTime(b[1]));

		// Find the index of the next prayer
		let nextPrayerIndex = prayerTimes.findIndex(
			([key, time]) => parseTime(time) > currentTimeMinutes
		);

		if (nextPrayerIndex === -1) {
			// No more prayers today, handle tomorrow's Fajr
			if (!skipNextPrayerCalculationAndShowFajr.value) {
				todayDate.value = new Date(
					todayDate.value.getTime() + 24 * 60 * 60 * 1000
				);
				skipNextPrayerCalculationAndShowFajr.value = true;
				loadIslandData();
			}
			return { name: "f", time: todaysPrayers.value.f };
		}

		const nextPrayer = prayerTimes[nextPrayerIndex];
		updateDiff(currentTime, nextPrayer[1]);
		return { name: nextPrayer[0], time: nextPrayer[1] };
	};

	onMounted(() => {
		loadIslandData();

		// Start countdown timer
		countdownInterval = setInterval(() => {
			if (timeDifference.value.minutes > 0) {
				timeDifference.value.minutes -= 1;
			} else if (timeDifference.value.hours > 0) {
				timeDifference.value.hours -= 1;
				timeDifference.value.minutes = 59;
			} else {
				calculateNextPrayer();
			}
		}, 60000);
	});

	onBeforeUnmount(() => {
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}
	});
	const hijriDate = computed(() => {
		return new Intl.DateTimeFormat("ar-MV-u-ca-islamic-umalqura", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(todayDate.value);
	});

	const gregorianDate = computed(() => {
		return new Intl.DateTimeFormat("en-MV", {
			weekday: "short",
			month: "short",
			day: "2-digit",
			year: "numeric",
		}).format(todayDate.value);
	});

	return {
		todaysPrayers,
		selectedIsland,
		showSettings,
		timeDifference,
		getCurrentTime,
		hijriDate,
		gregorianDate,
		PRAYER_NAMES,
		calculateNextPrayer,
		loadIslandData,
		skipNextPrayerCalculationAndShowFajr,
	};
};
