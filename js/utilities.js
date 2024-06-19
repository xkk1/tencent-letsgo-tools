/*
This file is part of tencent-letsgo-tools.
Copyright (C) 2024  xkk1

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
// 工具函数
"use strict";
const utilities = {};

/**
 * 防抖函数
 * 频繁操作、耗时操作、仅关心最后一次操作
 * 
 * @param {function} fn 要防抖的函数
 * @param {number} duration 防抖时间
 * @returns {function} 防抖后的函数
 */
utilities.debounce = function (fn, duration=300) {
    let timerId = null;
    return function () {
        if (timerId) {
            clearTimeout(timerId);
        }
        let args = arguments;
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, duration);
    }
}

/**
 * 节流函数
 * 频繁操作、耗时操作、仅关心连续操作
 * 
 * @param {function} fn 要节流的函数
 * @param {number} duration 节流时间
 * @returns {function} 节流后的函数
 */
utilities.throttle = function (fn, duration=300) {
    let lastTime = 0;
    return function () {
        let nowTime = Date.now();
        if (nowTime - lastTime > duration) {
            fn.apply(this, arguments);
            lastTime = nowTime;
        }
    }
}
