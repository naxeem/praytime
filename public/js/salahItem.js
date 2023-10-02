const { ref } = Vue;

export default {
	props: {
		// Define your props here
		prayerName: String,
		prayerTime: String, // Format 04:22
		nextPrayer: Object,
	},
	setup(props) {
		let isNextPrayer = ref(false);

		const prayerNameRef = {
			f: "Fajr",
			d: "Dhuhr",
			a: "Asr",
			m: "Maghrib",
			i: "Isha",
		};

		let currentPrayerName = prayerNameRef[props.prayerName];

		const rawatibRakats = {
			Fajr: { before: 2, after: 0 },
			Dhuhr: { before: 4, after: 2 },
			Maghrib: { before: 0, after: 2 },
			Isha: { before: 0, after: 2 },
		};

		const rakaths = ref({
			before: 0,
			after: 0,
		});

		if (rawatibRakats.hasOwnProperty(currentPrayerName)) {
			rakaths.value = rawatibRakats[currentPrayerName];
		}

		if (props.nextPrayer.name === props.prayerName) {
			isNextPrayer = true;
		}

		return { isNextPrayer, rakaths, currentPrayerName };
	},
	template: `<div><div class="flex items-center space-x-2" :class="[{'text-white/80' : !isNextPrayer}, {'text-orange-400' : isNextPrayer}]">
          <span class="shrink-0">
          <svg v-if="currentPrayerName === 'Maghrib' || currentPrayerName === 'Isha'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-blue-500">
  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
</svg>
<svg  v-if="currentPrayerName !== 'Maghrib' && currentPrayerName !== 'Isha'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 fill-yellow-500">
  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
</svg>


          </span>
					<h3 class="grow text-xl font-medium ">{{currentPrayerName}}</h3>
					<span class="shrink-0 text-lg"
						>{{prayerTime}}</span
					>
				</div>
        <div class="flex items-center px-1 pt-1">
          <div class="grow flex items-center space-x-1">
            <template v-if="rakaths.before !== 0">
              <span v-for="n in rakaths.before" :key="n" class="shrink-0 w-[2px] h-[2px] rounded-full bg-sky-600"></span>
            </template>
          </div>
          <div class="shrink-0 flex items-center space-x-1">
            <template v-if="rakaths.after !== 0">
              <span v-for="n in rakaths.after" :key="n" class="shrink-0 w-[2px] h-[2px] rounded-full bg-rose-600"></span>
            </template>
          </div>
        </div>
        </div>`,
};
