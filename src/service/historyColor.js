/*
 * @Date: 2020-06-02 15:51:20
 * @LastEditors: elegantYu
 * @LastEditTime: 2020-06-05 00:15:49
 * @Description: 颜色历史记录
 */

import { localGet, localSet, tabSendMessage } from "./base";

// 转换日期，若无日期使用当日
const nowDate = (time) => {
	const date = time ? new Date(time) : new Date();
	return date.toLocaleDateString();
};

// 保存颜色
const saveColor = ({ color }, { title, url, id }) =>
	new Promise((resolve) => {
		const today = nowDate();

		localGet("colorGroup").then((data) => {
			const isEmpty = !Object.keys(data).length;
			const oldData = isEmpty ? {} : data["colorGroup"];
			const item = { title, url, color };

			// 是否有记录
			let currData = {};
			if (isEmpty) {
				currData[today] = [item];
			} else {
				if (!oldData[today]) {
					oldData[today] = [];
				}
				currData = Object.assign(oldData, oldData[today].push(item));
			}

			localSet({ colorGroup: currData })
				.then(() => tabSendMessage([{ id }], { command: "destory" }))
				.then(() => resolve());
		});
	});

// 获取上次采集颜色
const getLastColor = () =>
	new Promise((resolve) => {
		localGet("colorGroup").then(({ colorGroup }) => {
			if (colorGroup) {
				const groups = Object.values(colorGroup).slice(-1)[0];
				const color = groups.slice(-1)[0].color;
				resolve(color);
			} else {
				resolve("rgb(255, 255, 255)");
			}
		});
	});

const getLastSevenDaysColor = () => new Promise(resolve => {
	localGet("colorGroup").then(({ colorGroup }) => {
		if (colorGroup) {
			const sevenDay = Object.values(colorGroup).slice(-7)
			const colors = [].concat.apply([], sevenDay).map(v => v.color)
			const duplicateColors = [...new Set(colors)]

			resolve(duplicateColors)
		} else {
			resolve(false)
		}
	})
})

export { saveColor, getLastColor, getLastSevenDaysColor };