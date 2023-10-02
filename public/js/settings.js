const { ref } = Vue;

import islandsList from "./islandsList.js";

export default {
	props: {
		// Define your props here
	},
	setup(props) {
		const atollList = [
			{
				atoll: "Haa Alifu",
			},
			{
				atoll: "Haa Dhaalu",
			},
			{
				atoll: "Shaviyani",
			},
			{
				atoll: "Noonu",
			},
			{
				atoll: "Raa",
			},
			{
				atoll: "Lhaviyani",
			},
			{
				atoll: "Baa",
			},
			{
				atoll: "Kaafu",
			},
			{
				atoll: "Alif Alif",
			},
			{
				atoll: "Alif Dhaalu",
			},
			{
				atoll: "Vaavu",
			},
			{
				atoll: "Meemu",
			},
			{
				atoll: "Faafu",
			},
			{
				atoll: "Dhaalu",
			},
			{
				atoll: "Thaa",
			},
			{
				atoll: "Laamu",
			},
			{
				atoll: "Gaafu Alif",
			},
			{
				atoll: "Gaafu Dhaalu",
			},
			{
				atoll: "Gnaviyani",
			},
			{
				atoll: "Seenu",
			},
		];

		const selectedAtoll = ref(localStorage.getItem("atoll"));
		const loadIsland = JSON.parse(localStorage.getItem("island"));
		const selectedIsland = ref(loadIsland);

		const filteredIslands = ref([]);

		filteredIslands.value = islandsList.filter(
			(item) => item.atoll === selectedAtoll.value
		);

		// console.log("filteredIslands", filteredIslands);

		const changeAtoll = (event) => {
			localStorage.setItem("atoll", selectedAtoll.value);

			filteredIslands.value = islandsList.filter(
				(item) => item.atoll === selectedAtoll.value
			);
		};
		const changeIsland = (event) => {
			localStorage.setItem("island", JSON.stringify(selectedIsland.value));
		};

		return {
			atollList,
			selectedAtoll,
			changeAtoll,
			filteredIslands,
			changeIsland,
			selectedIsland,
		};
	},
	template: `
  <div class="bg-slate-900 absolute z-10 top-16 right-0 bottom-0 left-0 overflow-y-scroll text-white">
    <div class="max-w-md mx-auto px-5 pt-5 space-y-4">
      <div>
        <label for="atoll" class="block mb-2 text-sm font-medium text-white">Select Atoll</label>
        <select v-model="selectedAtoll" @change="changeAtoll()" id="atoll" class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <option v-for="item in atollList" :key="item.atoll" :value="item.atoll">{{item.atoll}}</option>
        </select>
      </div>
        <div>
        <label for="atoll" class="block mb-2 text-sm font-medium text-white">Select Island</label>
        <select v-model="selectedIsland" @change="changeIsland()" id="island" class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <option v-for="item in filteredIslands" :key="item.island" :value="item">{{item.island}}</option>
        </select>
      </div>
    </div>
  </div>
  `,
};
