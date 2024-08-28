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

// 这里是星宝农场浇水建议生成的核心代码，我是 xkk1，我的算法可能不是最好的
// 欢迎来 PR(pull requests) 提供您的算法

// 启用严格模式
"use strict";

/**
 * 农场计算建议浇水时间父类
 * 您可以通过继承该类来实现自己的算法
 * 
 * @author xkk1
 */
class SuggestedWateringTimeBase {
    /**
     * 需被重写，获取作者信息
     * 
     * @returns {object} 作者信息
     */
    static getAuthorInformation() {
        return {
            name: "xkk1", // 作者名称
            url: "https://github.com/xkk1"  // 作者社交网站链接
        };
    }

    /**
     * 建议重写构造函数完成浇水策略计算，调用 toHTML() 方法获取实时结果
     * 
     * @param {number} totalMaturityTime 该类作物总成熟时间即收获周期(s)
     * @param {number} remainingMaturityTime 作物剩余成熟时间(s)
     * @param {number} remainingWaterDuration 水分保持剩余时间(s)
     * @param {number} calculationTime 请求浇水策略计算时间戳
     */
    constructor(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime) {
        this.totalMaturityTime = totalMaturityTime;
        this.remainingMaturityTime = remainingMaturityTime;
        this.remainingWaterDuration = remainingWaterDuration;
        this.calculationTime = calculationTime;
    }

    /**
     * 获取浇水建议（实时）,没有建议返回空字符串 ""
     * 
     * @returns {string} 浇水建议，HTML 格式
     */
    toHTML() {
        return "";
    }
}

/**
 * 作物基本信息类
 * 这也是个基础使用示例
 */
class CropInformation extends SuggestedWateringTimeBase {
    /**
     * 需被重写，获取作者信息
     * 
     * @returns {object} 作者信息
     */
    static getAuthorInformation() {
        return {
            name: "小喾苦(UID:1197987226)", // 作者名称
            url: "https://github.com/xkk1"  // 作者 GitHub 地址
        };
    }

    /**
     * 由于这里仅显示作物信息，无需计算浇水策略
     * 
     * @param {number} totalMaturityTime 该类作物总成熟时间即收获周期(s)
     * @param {number} remainingMaturityTime 作物剩余成熟时间(s)
     * @param {number} remainingWaterDuration 水分保持剩余时间(s)
     * @param {number} calculationTime 请求浇水策略计算时间戳
     */
    constructor(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime) {
        super(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime);
        // 在这里计算一些不会随时间改变的数据
        // 浇水后水分保持时间 (s) = 该类作物总成熟时间 / 3
        this.wateringAfterWaterDuration = this.totalMaturityTime / 3;
        // 地干后浇水减少时间（一次浇水最大减少时间） (s) = 该类作物总成熟时间 / 12
        this.wateringAfterWaterDurationReduce = this.totalMaturityTime / 12;
        // 禁止浇水时间 (s) = 该类作物总成熟时间 / 30
        this.prohibitedWateringSeconds = this.totalMaturityTime / 30;
        // 工具函数
        let formatSeconds = this.constructor.formatSeconds;
        let formateDate = this.constructor.formateDate;
        // 作物固定信息字符串
        this.fixedInformation = `
收获周期：${formatSeconds(this.totalMaturityTime)}<br />
浇水后水分维持时间：${formatSeconds(this.wateringAfterWaterDuration)}<br />
地干后浇水减少时间：${formatSeconds(this.wateringAfterWaterDurationReduce)}<br />
禁止浇水时间：${formatSeconds(this.prohibitedWateringSeconds)}<br />
查询时间：${formateDate(new Date(this.calculationTime))}
        `
    }

    /**
     * 获取实时作物信息
     * 
     * @returns {string} HTML 格式的浇水建议 
     */
    toHTML () {
        let resultHTML = "";
        // 工具函数
        let formatSeconds = this.constructor.formatSeconds;
        let formateDate = this.constructor.formateDate;
        let formatSecondsDate = this.constructor.formatSecondsDate;
        // 计算这次信息时的时间
        let nowTime = Date.now();
        // 距离计算时经过的秒数
        let passedSecond = (nowTime - this.calculationTime) / 1000;
        // 现在的数据
        // 现在作物剩余成熟时间(s)
        let remainingMaturityTime = this.remainingMaturityTime - passedSecond;
        // 现在水分保持剩余时间(s)
        let remainingWaterDuration = this.remainingWaterDuration - passedSecond;
        
        
        // 剩余水分
        let remainingWaterDurationString = "";
        if (remainingWaterDuration <= 0) {
            remainingWaterDurationString = "<br />土地干涸，浇水能加快作物成熟";
        } else {
            remainingWaterDurationString = `<br />水分还能维持${formatSecondsDate(nowTime, remainingWaterDuration).replace("后", "")}`;
        }
        // 作物成熟状态
        let remainingMaturityTimeString = "";
        if (this.remainingMaturityTime <= 0) {
            remainingMaturityTimeString = "农作物已成熟";
        } else {
            remainingMaturityTimeString = `${formatSecondsDate(nowTime, remainingMaturityTime)}成熟${remainingWaterDurationString}`;
        }
        resultHTML += `<p><strong>作物信息</strong><br />
${remainingMaturityTimeString}<br />`;
        // 是否能浇水
        // 距离上次浇水时间
        let lastWateringTime = this.wateringAfterWaterDuration - remainingWaterDuration;
        if (lastWateringTime < this.prohibitedWateringSeconds) {
            resultHTML += `无法浇水，可在${formatSecondsDate(nowTime, this.prohibitedWateringSeconds - lastWateringTime)}浇水<br />`;
        } else {
            resultHTML += `现在浇水减少时间：${formatSeconds(lastWateringTime / 4)}<br />`;
        }
        resultHTML += this.fixedInformation;
        resultHTML += `</p>`;
        return resultHTML;
    }

    /**
     * 格式化时间
     * 
     * @param {Date} date 
     * @returns {string}
     */
    static formateDate(date) {
        function padZero(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = padZero(date.getMinutes());
        let second = padZero(date.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }


    /**
     * 格式化秒数为{x天x小时x分x秒}格式
     * 
     * @param {number} second 秒 
     * @returns {string} x天x小时x分x秒
     */
    static formatSeconds(second) {
        // 秒数为整数
        second = Math.floor(second);
        // 天
        let day = Math.floor(second / 86400);
        // 小时
        let hour = Math.floor((second - day * 86400) / 3600);
        // 分钟
        let minute = Math.floor((second - day * 86400 - hour * 3600) / 60);
        // 秒
        let second_ = Math.floor(second - day * 86400 - hour * 3600 - minute * 60);
        // 返回结果字符串
        let result = "";
        if (day !== 0) {
            result += `${day}天`;
        }
        if (hour !== 0) {
            result += `${hour}小时`;
        }
        if (minute !== 0) {
            result += `${minute}分`;
        }
        if (second_ !== 0) {
            result += `${second_}秒`;
        }
        return result;
    }

    /**
     * 格式化输出为 {时分秒}后({年月日时分秒})
     * 
     * @param {number} beforeTime 计算结束时的时间戳
     * @param {number} afterSecond 之后经过的时间(s)
     * @returns {string} "{元梦时分秒}后({年月日时分秒})"
     */
    static formatSecondsDate(beforeTime, afterSecond) {
        let formatSeconds = CropInformation.formatSeconds;
        let formateDate = CropInformation.formateDate;
        let afterDate = new Date(beforeTime + afterSecond * 1000);
        // 真实距离现在的秒
        let second = Math.floor((afterDate.getTime() - Date.now()) / 1000);
        if (second > 0) {
            return `${formatSeconds(second)}后(${formateDate(afterDate)})`;
        } else if (second < 0) {
            return `${formatSeconds(-second)}前(${formateDate(afterDate)})`;
        } else {
            return `现在(${formateDate(afterDate)})`;
        }
    }
}

/**
 * xkk1 浇水建议核心算法，不一定是最好的
 * 这也是个示例，您可以在下方添加更好的算法
 * 
 * @author xkk1
 */
class Xkk1SuggestedWateringTime extends SuggestedWateringTimeBase {
    /**
     * 需被重写，获取作者信息
     * 
     * @returns {object} 作者信息
     */
    static getAuthorInformation() {
        return {
            name: "小喾苦", // 作者名称
            url: "https://github.com/xkk1"  // 作者 GitHub 地址
        };
    }

    /**
     * 我这里使用构造函数完成浇水策略计算，调用 toString() 方法获取实时浇水建议
     * 
     * @param {number} totalMaturityTime 该类作物总成熟时间即收获周期(s)
     * @param {number} remainingMaturityTime 作物剩余成熟时间(s)
     * @param {number} remainingWaterDuration 水分保持剩余时间(s)
     * @param {number} calculationTime 请求浇水策略计算时间戳
     */
    constructor(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime) {
        super(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime);
        // 农场浇水时间计算核心算法 by xkk1
        let wateringTimes = []; // 最佳浇水时间(s)
        let maxMaturityTime = remainingMaturityTime;
        let minMaturityTime = undefined;

        // 禁止浇水时间
        const forbiddenWateringTime = totalMaturityTime / 30;
        // 最大水分保持时间
        const maxRemainingWaterDuration = totalMaturityTime / 3;
        if ((maxRemainingWaterDuration - remainingWaterDuration) + remainingMaturityTime < forbiddenWateringTime) {
            // 无法浇水时 最快作物成熟时间 = 最久作物成熟时间
            minMaturityTime = maxMaturityTime;
        } else {
            // 计算浇水次数 begin
            let wateringCount = 0; 
            // 模拟浇水
            let tempRemainingMaturityTime = remainingMaturityTime; // 模拟作物剩余成熟时间
            let tempRemainingWaterDuration = remainingWaterDuration; // 模拟水分保持剩余时间
            if (tempRemainingWaterDuration > tempRemainingMaturityTime) {
                // 模拟水分保持剩余时间 > 模拟作物剩余成熟时间
                wateringCount = 1;
            } else {
                // 等待到地干了（使模拟水分保持剩余时间 = 0）
                if (tempRemainingMaturityTime >= tempRemainingWaterDuration) {
                    tempRemainingMaturityTime -= tempRemainingWaterDuration;
                    tempRemainingWaterDuration = 0;
                }
                // 计算一次浇水减少的时间（设该类作物总成熟时间为x） = x/3 + x/12 = 5x/12
                let wateringTimeDecrease = 5 * totalMaturityTime / 12;
                wateringCount = Math.floor(tempRemainingMaturityTime / wateringTimeDecrease)
                if (tempRemainingMaturityTime / wateringTimeDecrease !== 0) {
                    wateringCount++;
                }
                minMaturityTime = 4 * tempRemainingMaturityTime / 5; // (x/3) / (x/3 + x/12) = 4x / 5
            }
            // 计算浇水次数 end


            // 计算最佳浇水时间 begin
            if (wateringCount !== 1) {
                // 浇水间隔时间
                let wateringIntervalTime = minMaturityTime / (wateringCount + 1);
                for (let i = 1; i <= wateringCount; i++) {
                    wateringTimes.push(i * wateringIntervalTime);
                }
            } else {
                // 此时需要卡点，最后一次浇水后就可以收获 但我不想算了
                wateringTimes.push(remainingMaturityTime / 2);
                // 计算最快作物成熟时间
                minMaturityTime = remainingMaturityTime - ((maxRemainingWaterDuration - remainingWaterDuration - (remainingMaturityTime / 2)) / 4);
            }
            // 计算最佳浇水时间 end
        }
        this.wateringTimes = wateringTimes; // 最佳浇水时间数组，每个数据是距离现在的浇水时间，单位秒
        this.maxMaturityTime = maxMaturityTime; // 最久作物成熟时间  数值与 totalMaturityTime 相同
        this.minMaturityTime = minMaturityTime; // 最快作物成熟时间
    }

    /**
     * 格式化时间
     * 
     * @param {Date} date 
     * @returns {string}
     */
    static formateDate(date) {
        function padZero(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = padZero(date.getMinutes());
        let second = padZero(date.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }


    /**
     * 格式化秒数为元梦天、小时、分、秒格式
     * 
     * @param {number} second 秒 
     * @returns {string}
     */
    static formatSeconds(second) {
        // 秒数为整数
        second = Math.floor(second);
        // 天
        let day = Math.floor(second / 86400);
        // 小时
        let hour = Math.floor((second - day * 86400) / 3600);
        // 分钟
        let minute = Math.floor((second - day * 86400 - hour * 3600) / 60);
        // 秒
        let second_ = Math.floor(second - day * 86400 - hour * 3600 - minute * 60);
        // 返回结果字符串
        let result = "";
        if (day !== 0) {
            result += `${day}天`;
        }
        if (hour !== 0) {
            result += `${hour}小时`;
        }
        if (minute !== 0) {
            result += `${minute}分`;
        }
        if (second_ !== 0) {
            result += `${second_}秒`;
        }
        return result;
    }

    /**
     * 格式化输出为 {元梦时分秒}后({年月日时分秒})
     * 
     * @param {number} beforeTime 计算结束时的时间戳
     * @param {number} afterSecond 之后经过的时间(s)
     * @returns {string} "{元梦时分秒}后({年月日时分秒})"
     */
    static formatSecondsDate(beforeTime, afterSecond) {
        let formatSeconds = Xkk1SuggestedWateringTime.formatSeconds;
        let formateDate = Xkk1SuggestedWateringTime.formateDate;
        let afterDate = new Date(beforeTime + afterSecond * 1000);
        // 真实距离现在的秒
        let second = Math.floor((afterDate.getTime() - Date.now()) / 1000);
        if (second > 0) {
            return `${formatSeconds(second)}后(${formateDate(afterDate)})`;
        } else if (second < 0) {
            return `${formatSeconds(-second)}前(${formateDate(afterDate)})`;
        } else {
            return `现在(${formateDate(afterDate)})`;
        }
    }

    /**
     * 获取实时浇水建议
     * Markdown 格式
     */
    toMarkdown () {
        let result = "";
        let formatSeconds = Xkk1SuggestedWateringTime.formatSeconds;
        let formateDate = Xkk1SuggestedWateringTime.formateDate;
        let formatSecondsDate = Xkk1SuggestedWateringTime.formatSecondsDate;
        // 剩余水分
        let remainingWaterDurationString = "";
        if (this.remainingWaterDuration <= 0) {
            remainingWaterDurationString = "干涸";
        } else {
            remainingWaterDurationString = `水分还能保持${formatSeconds(this.remainingWaterDuration)}`;
        }
        // 作物成熟状态
        let remainingMaturityTimeString = "";
        if (this.remainingMaturityTime <= 0) {
            remainingMaturityTimeString = "已成熟";
        } else {
            remainingMaturityTimeString = `${formatSeconds(this.remainingMaturityTime)}后成熟(${remainingWaterDurationString})`;
        }
        result += `**查询信息**
- 该作物收获周期：${formatSeconds(this.totalMaturityTime)}
- 作物状态：${remainingMaturityTimeString}
- 查询时间：${formateDate(new Date(this.calculationTime))}

`;
        if (this.wateringTimes.length === 0) {
            result += `**作物成熟时间**：${formatSecondsDate(this.calculationTime, this.remainingMaturityTime)}成熟。\n`;
            return result;
        }
        result += "**作物成熟时间范围**\n";
        result += `- **最早**：${formatSecondsDate(this.calculationTime, this.minMaturityTime)}\n`;
        result += `- **最晚**：${formatSecondsDate(this.calculationTime, this.maxMaturityTime)}\n`;
        result += `\n**浇水建议**\n\n`;
        result += `建议至少浇水${this.wateringTimes.length}次。以下是每次浇水的详细时间：\n`;
        // 模拟浇水
        // this.wateringTimes.unshift(0);
        let tempWateringTimes = Array.from(this.wateringTimes); // 拷贝数组
        tempWateringTimes.unshift(0)
        let tempRemainingMaturityTime = this.remainingMaturityTime; // 模拟作物剩余成熟时间
        let tempRemainingWaterDuration = this.remainingWaterDuration; // 模拟水分保持剩余时间
        for (let i = 1; i < tempWateringTimes.length; i++) {
            tempRemainingMaturityTime -= tempWateringTimes[i] - tempWateringTimes[i-1];
            
            if (tempRemainingWaterDuration > tempWateringTimes[i] - tempWateringTimes[i-1]) {
                // 若浇水时，地没干
                tempRemainingMaturityTime -= (tempRemainingWaterDuration - (tempWateringTimes[i] - tempWateringTimes[i-1])) / 4;
            } else {
                tempRemainingMaturityTime -= this.totalMaturityTime / 12;
            }
            result += `\n${i}. **第${i}次浇水**：\n`;
            result += `    - **浇水时间**：${formatSecondsDate(this.calculationTime, tempWateringTimes[i])}\n`;
            result += "    - **浇水后作物状态**："
            // console.log(formatSecondsDate(this.calculationTime, tempWateringTimes[i]), this.calculationTime, tempWateringTimes[i]);
            if (tempRemainingMaturityTime > 0) {
                result += `${formatSeconds(tempRemainingMaturityTime)}后成熟\n`;
            } else {
                // 作物已成熟
                result += `成熟\n`;
            }
            tempRemainingWaterDuration = this.totalMaturityTime / 3;
        }
        if (tempRemainingMaturityTime > 0) {
            result += `\n**作物最终成熟时间**：${formatSecondsDate(this.calculationTime, tempRemainingMaturityTime + this.wateringTimes[this.wateringTimes.length - 1])}\n`;
        }
        return result;
    }

    /**
     * 获取 HTML 格式的浇水建议
     * 
     * @returns {string} HTML 格式的浇水建议 
     */
    toHTML () {
        return marked.parse(this.toMarkdown());
    }
}



/**
 * 小卿的算法
 * 以下公式所有时间单位均为分钟
 * 距离当前时间剩余收获时间 = (12 * 水分保持时间 * 目前剩余收获时间 - 收获周期 * 水分保持时间 + 收获周期 * 目前土地湿润剩余时间) / (12 * 水分保持时间 +  收获周期)
 * 此公式仅适用于： 水分保持时间 >= 目前剩余收获时间
 */
class LubiandewoheniSuggestedWateringTime extends SuggestedWateringTimeBase {
    /**
     * 感谢小卿提供的算法
     * 
     * @returns {object} 作者信息
     */
    static getAuthorInformation() {
        return {
            name: "小卿予你", // 作者名称
        };
    }

    /**
     * 建议重写构造函数完成浇水策略计算，调用 toHTML() 方法获取实时结果
     * 
     * @param {number} totalMaturityTime 该类作物总成熟时间即收获周期(s)
     * @param {number} remainingMaturityTime 作物剩余成熟时间(s)
     * @param {number} remainingWaterDuration 水分维持剩余时间(s)
     * @param {number} calculationTime 请求浇水策略计算时间戳
     */
    constructor(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime) {
        super(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime);
        // 以下时间均以分钟为单位
        let 收获周期 = this.totalMaturityTime / 60;
        let 目前剩余收获时间 = this.remainingMaturityTime / 60;
        let 目前土地湿润剩余时间 = this.remainingWaterDuration / 60;
        let 水分最大维持时间 = this.totalMaturityTime / 3 / 60;
        let 水分维持剩余时间 = this.remainingWaterDuration / 60;
        let 禁止浇水时间 = this.totalMaturityTime / 30 / 60;
        this.浇水后能收获 = true;
        if (水分最大维持时间 >= 目前剩余收获时间 && 水分最大维持时间 - 水分维持剩余时间 >= 禁止浇水时间 && 目前剩余收获时间 < (水分最大维持时间 - 水分维持剩余时间) / 4) {
            // 水分最大维持时间 >= 目前剩余收获时间 并且目前浇水后能熟
            this.距离当前时间剩余收获时间 = 0;
        } else if (水分最大维持时间 >= 目前剩余收获时间) {
            // 此公式仅适用于： 水分最大维持时间 >= 目前剩余收获时间 并且目前浇水后不能熟
            this.距离当前时间剩余收获时间 = (12 * 水分最大维持时间 * 目前剩余收获时间 - 收获周期 * 水分最大维持时间 + 收获周期 * 目前土地湿润剩余时间) / (12 * 水分最大维持时间 +  收获周期);
        } else {
            this.浇水后能收获 = false;
            this.距离当前时间剩余收获时间 = (目前剩余收获时间 - (1 - 水分维持剩余时间 / 水分最大维持时间) / 12 * 收获周期) * 4 / 5;
        }
    }

    /**
     * 获取浇水建议（实时）
     * 
     * @returns {string} 浇水建议，HTML 格式
     */
    toHTML() {
        if (this.浇水后能收获) {
            return `<p>下次浇水后直接收获时间：${CropInformation.formatSecondsDate(this.calculationTime, this.距离当前时间剩余收获时间 * 60)}</p>`;
        } else {
            return`<p>剩余收获时间：${CropInformation.formatSecondsDate(this.calculationTime, this.距离当前时间剩余收获时间 * 60)}</p>`
        }
    }
}

// 将您实现算法的类加入到下面的数组中
let SuggestedWateringTimeClassArray = [
    CropInformation, // 小喾苦(UID:1197987226)
    LubiandewoheniSuggestedWateringTime // 小卿予你
];

// 以下是调用显示

/**
 * 修改地址栏 URL 参数,不跳转
 * 
 * @param {string} name 参数名
 * @param {string} value 参数值
 * @param {boolean} flag 是否返回，不提供则直接地址栏 URL 参数
 * @returns 
 */
function changeURLStatic(name, value, flag) {
    let url = window.location.search;
    let reg = eval('/([\?|&]' + name + '=)[^&]*/gi');
    // value = value.toString().replace(/(^\s*)|(\s*$)/g, "");  //移除首尾空格
    let url2 = "";
    if (value === undefined || value === null) {
        url2 = url.replace(reg, '');  //正则替换
    } else {
        if (url.match(reg)) {
            url2 = url.replace(reg, '$1' + value);  //正则替换
        } else {
            url2 = url + (url.indexOf('?') > -1 ? '&' : '?') + name + '=' + value;  //没有参数添加参数
        }
    }
    url2 = window.location.origin + window.location.pathname + url2 + window.location.hash;
    if (flag) {
        return url2;
    }
    history.replaceState(null, null, url2);  //替换地址栏
}
//当前页面地址
//index.php?m=p&a=index&classify_id=225&search=i
//执行修改
//changeURLStatic('search', '99999');
//修改后页面地址
//index.php?m=p&a=index&classify_id=225&search=99999


//获取 URL get 参数
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        }
    }
    return null;
}
/*
使用实例
url 实例：

http://www.runoob.com/index.php?id=1&image=awesome.jpg
调用 getQueryVariable("id") 返回 1。

调用 getQueryVariable("image") 返回 "awesome.jpg"。
*/

/**
 * 防止 Element 事件后 value 为空字符串
 * 
 * @param {string} defaultValue 该 Element 默认 value
 * @returns {Function} 添加在事件监听的阻止为空的函数
 */
function valueNoEmptyString(defaultValue) {
    let beforeValue = defaultValue;
    return (function (event) {
        if (!event.target.value) {
            event.stopImmediatePropagation();
            setTimeout(() => {
                event.target.value = beforeValue;
            }, 0);
        } else {
            beforeValue = event.target.value;
        }
    });
}

/**
 * 获取用户输入的作物成熟时间
 * 
 * @returns {number} 总成熟时间(s)
 */
function getTotalMaturityTime() {
    return parseInt(document.getElementById("totalMaturityTimeSelect").value);
}

/**
 * 获取用户输入的作物剩余成熟时间
 * 
 * @returns {number} 剩余成熟时间(s)
 */
function getRemainingMaturityTime() {
    return ((parseInt(document.getElementById("remainingMaturityTimeDaySelect").value) * 24 +
        parseInt(document.getElementById("remainingMaturityTimeHourSelect").value)) * 60 + 
        parseInt(document.getElementById("remainingMaturityTimeMinuteSelect").value)) * 60 +
        parseInt(document.getElementById("remainingMaturityTimeSecondSelect").value);
}

/**
 * 获取用户输入的作物剩余水分保持时间
 * 
 * @returns {number} 剩余水分保持时间(s)
 */
function getRemainingWaterDuration() {
    return ((/* mparseInt(document.getElementById("remainingWaterDurationDaySelect").value) * 24 + 水分不可能保持超过一天 */
        parseInt(document.getElementById("remainingWaterDurationHourSelect").value)) * 60 + 
        parseInt(document.getElementById("remainingWaterDurationMinuteSelect").value)) * 60 +
        parseInt(document.getElementById("remainingWaterDurationSecondSelect").value);

}

/**
 * 判断用户输入是否正确
 * 
 * @param {number} totalMaturityTime 总成熟时间(s)
 * @param {number} remainingMaturityTime 剩余成熟时间(s)
 * @param {number} remainingWaterDuration 剩余水分维持时间(s)
 * @param {boolean} showErrorInformation 是否显示数据错误信息弹框，默认 true(显示)
 * @returns {boolean} true: 输入正确 false: 输入错误
 */
function checkTimeInput(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, showErrorInformation=true) {
    // 工具函数
    let formatSeconds = CropInformation.formatSeconds;
    // 判断输入是否正确
    if (totalMaturityTime < remainingMaturityTime) {
        if (showErrorInformation) {
            mdui.alert({
                headline: "剩余成熟时间输入错误",
                description: `剩余成熟时间(${formatSeconds(remainingMaturityTime)})不能大于该作物的总成熟时间(${formatSeconds(totalMaturityTime)})`,
                confirmText: "确定"
            });
        }
        return false;
    }
    // 浇水后水分维持时间 (s) = 该类作物总成熟时间 / 3
    let wateringAfterWaterDuration = totalMaturityTime / 3;
    if (remainingWaterDuration > wateringAfterWaterDuration) {
        if (showErrorInformation) {
            mdui.alert({
                headline: "剩余水分维持时间输入错误",
                description: `剩余水分维持时间(${formatSeconds(remainingWaterDuration)})不能大于该作物的最大水分维持时间(${formatSeconds(wateringAfterWaterDuration)})`,
                confirmText: "确定"
    
            });
        }
        return false;
    }
    
    return true;
}



// 浇水建议结果容器模板 HTMLElement
class ResultContainer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<slot></slot>
        `.trim();
    }
}
// 注册自定义元素 result-container
customElements.define('result-container', ResultContainer);


// 浇水建议结果模板 HTMLElement
class ResultItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 获取建议者链接
        let href = "";
        if (this.hasAttribute("href")) {
            href = this.getAttribute("href");
        }
        let hrefAttribute = "";
        if (href !== "") {
            hrefAttribute = ` href="${href}" target="_blank"`;
        }
        // 获取建议者的姓名
        let author = "";
        if (this.hasAttribute("author")) {
            author = this.getAttribute("author");
        }
        let authorHTML = "";
        if (author !== "") {
            authorHTML = `
<mdui-chip${hrefAttribute}>
    <mdui-icon-person slot="icon"></mdui-icon-person>
    ${author}
</mdui-chip><br />
            `.trim();
        }
        
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<div style="padding: 0.5rem;">
    <mdui-card style="width: 100%; padding: 0.5rem;">
         ${authorHTML}
        <slot></slot>
    </mdui-card>
</div>
        `.trim();
    }
}
// 注册自定义元素 result-item
customElements.define('result-item', ResultItem);





document.addEventListener('DOMContentLoaded', () => {
    // 加载感谢信息
    let thanksHTML = "";
    SuggestedWateringTimeClassArray.forEach(suggestedWateringTimeClass => {
        let authorInformation = suggestedWateringTimeClass.getAuthorInformation();
        if (authorInformation.name) {
            let authorInformationAttribute = ""
            if (authorInformation.url) {
                authorInformationAttribute += ` href="${authorInformation.url}" target="_blank"`;
            }
            thanksHTML += `
<mdui-chip${authorInformationAttribute}>
    <mdui-icon-person slot="icon"></mdui-icon-person>
    ${authorInformation.name}
</mdui-chip>
        `;
        }
    });
    // 阻止默认选择框为空字符串
    [
        "totalMaturityTimeSelect",
        "remainingMaturityTimeDaySelect",
        "remainingMaturityTimeHourSelect",
        "remainingMaturityTimeMinuteSelect",
        "remainingMaturityTimeSecondSelect",
        "remainingWaterDurationHourSelect",
        "remainingWaterDurationMinuteSelect",
        "remainingWaterDurationSecondSelect"
    ].forEach((elementId) => {
        document.getElementById(elementId).addEventListener("change", valueNoEmptyString(document.getElementById(elementId).value));
    });
    document.getElementById('thanks-span').innerHTML = thanksHTML;
    // 作物信息对话框
    const askCropInformationDialogElement = document.getElementById('ask-crop-information-dialog');
    // 打开作物信息对话框
    document.getElementById('ask-crop-information-dialog-open-button').addEventListener('click', () => {
        askCropInformationDialogElement.open = true;
    });
    document.getElementById('example-ask-crop-information-dialog-open-button').addEventListener('click', () => {
        askCropInformationDialogElement.open = true;
    });
    // 关闭作物信息对话框
    document.getElementById("ask-crop-information-dialog-close-button").addEventListener("click", () => {
        askCropInformationDialogElement.open = false;
    });
    

    // 打开高级设置
    let openAdvancedSettingsSwitchElement = document.getElementById("open-advanced-settings-switch");
    openAdvancedSettingsSwitchElement.addEventListener("change", () => {
        if (openAdvancedSettingsSwitchElement.checked) {
            document.getElementById("advanced-settings-container").style.display = "block";
        } else {
            document.getElementById("advanced-settings-container").style.display = "none";
        }
    });  
    // 启用秒输入
    let enableSecondsInputSwitchElement = document.getElementById("enable-seconds-input-switch");
    enableSecondsInputSwitchElement.addEventListener("change", () => {
        if (enableSecondsInputSwitchElement.checked) {
            document.querySelectorAll(".seconds-input-container").forEach(element => {
                element.style.display = "block";
            });
            document.getElementById("calculation-time-input").step = "1";
        } else {
            document.querySelectorAll(".seconds-input-container").forEach(element => {
                element.style.display = "none";
            });
            document.getElementById("calculation-time-input").step = "60";
        }
    });
    // 设置开始时间
    function setCalculationTimeToNow() {
        let date = new Date();
        function padZero(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        }
        let year = date.getFullYear();
        let month = padZero(date.getMonth() + 1);
        let day = padZero(date.getDate());
        let hour = padZero(date.getHours());
        let minute = padZero(date.getMinutes());
        let second = padZero(date.getSeconds());
        document.getElementById("calculation-date-input").value = `${year}-${month}-${day}`;
        if (enableSecondsInputSwitchElement.checked) {
            document.getElementById("calculation-time-input").value =  `${hour}:${minute}:${second}`;
        } else {
            document.getElementById("calculation-time-input").value = `${hour}:${minute}`;
        }

    }
    let setCalculationTimeSwitchElement = document.getElementById("set-calculation-time-switch");
    setCalculationTimeSwitchElement.addEventListener("change", () => {
        if (setCalculationTimeSwitchElement.checked) {
            setCalculationTimeToNow()
            document.getElementById("calculation-time-container").style.display = "flex";
        } else {
            document.getElementById("calculation-time-container").style.display = "none";
        }
    });
    document.getElementById("set-calculation-time-to-now-button").addEventListener("click", () => {
        setCalculationTimeToNow();
    });


    // 浇水策略计算结果显示定时器
    let generateWateringSuggestionInterval = null;
    // 建议结果显示
    let resultContainerElement = document.querySelector("result-container");
    function generateWateringSuggestionFunction(totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime) {
        // 停止上一次的实时计算
        if (generateWateringSuggestionInterval) {
            clearInterval(generateWateringSuggestionInterval);
        }
        // 浇水策略计算结果对象数组
        let suggestedWateringTimeObjectArray = [];
        SuggestedWateringTimeClassArray.forEach((SuggestedWateringTimeClass) => {
            suggestedWateringTimeObjectArray.push(new SuggestedWateringTimeClass(
                totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime
            ));
        });
        document.suggestedWateringTimeObjectArray = suggestedWateringTimeObjectArray;
        generateWateringSuggestionInterval = setInterval(() => {
            // 实时更新浇水建议
            let result = "";
            suggestedWateringTimeObjectArray.forEach((suggestedWateringTimeObject) => {
                let suggestedWateringTimeHTML = suggestedWateringTimeObject.toHTML();
                // 建议不为空是才显示
                if (suggestedWateringTimeHTML !== "") {
                    let authorInformation = suggestedWateringTimeObject.constructor.getAuthorInformation();
                    let authorInformationAttribute = ""
                    if (authorInformation.name) {
                        authorInformationAttribute += ` author="${authorInformation.name}"`;
                        if (authorInformation.url) {
                            authorInformationAttribute += ` href="${authorInformation.url}"`;
                        }
                    }
                    result += `<result-item${authorInformationAttribute}>` + suggestedWateringTimeHTML + "</result-item>";
                }
            });
            resultContainerElement.innerHTML = result;
        }, 1000);
        
    }

    // 复制链接到剪贴板并显示提示
    function copyLink() {
        utilities.copyText(window.location.href);
        mdui.snackbar({
            message: "链接已复制到剪贴板",
            autoCloseDelay: 3000,
            closeable: true
        });
    }

    // 显示分享链接
    document.getElementById("share-link-button").addEventListener("click", copyLink);
    function showShareLink() {
        document.getElementById("share-link-div").style.display = "block";
    }

    // 生成浇水建议
    document.getElementById("generate-watering-suggestion-button").addEventListener("click", () => {
        // 获取用户输入
        let totalMaturityTime = getTotalMaturityTime(); // 总成熟时间(s)
        let remainingMaturityTime = getRemainingMaturityTime(); // 剩余成熟时间(s)
        let remainingWaterDuration = getRemainingWaterDuration();  // 剩余水分保持时间(s)
        if (checkTimeInput(totalMaturityTime, remainingMaturityTime, remainingWaterDuration)) {
            mdui.snackbar({
                message: "正在为您生成浇水建议……",
                action: "复制链接",
                onActionClick: copyLink
            });
            askCropInformationDialogElement.open = false;
            let calculationTime = Date.now(); // 当前时间戳
            if (setCalculationTimeSwitchElement.checked) {
                calculationTime = new Date(document.getElementById("calculation-date-input").value + "T" + document.getElementById("calculation-time-input").value).getTime();
            }
            generateWateringSuggestionFunction(
                totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime
            );
            // 修改地址栏 get 参数
            changeURLStatic("tmt" , totalMaturityTime);
            changeURLStatic("rmt" , remainingMaturityTime);
            changeURLStatic("rwd" , remainingWaterDuration);
            changeURLStatic("ct" , parseInt(calculationTime / 1000));
            // 显示分享链接
            showShareLink();
        } else {
            mdui.snackbar({
                message: "输入不合法，请检查输入的时间内容是否正确",
                closeable: true
            });
        }
        
    });

    // 读取地址栏参数，并显示数据
    (function () {
        /**
         * 判断字符串是不是有效的非负整数
         * 
         * @param {string} str 要检测的数字字符串 
         * @returns {boolean} true: 是有效非负整数 false: 不是有效非负整数
         */
        function isInteger(str) {
            const num = parseInt(str, 10);
            return !isNaN(num) && num >= 0 && str === num.toString();
        }

        let totalMaturityTime = getQueryVariable("tmt"); // 总成熟时间(s)
        if (totalMaturityTime === null || !isInteger(totalMaturityTime)) {
            return;
        }
        totalMaturityTime = parseInt(totalMaturityTime);

        let remainingMaturityTime = getQueryVariable("rmt"); // 剩余成熟时间(s)
        if (remainingMaturityTime === null || !isInteger(remainingMaturityTime)) {
            return;
        }
        remainingMaturityTime = parseInt(remainingMaturityTime);

        let remainingWaterDuration = getQueryVariable("rwd");  // 剩余水分保持时间(s)
        if (remainingWaterDuration === null || !isInteger(remainingWaterDuration)) {
            return;
        }
        remainingWaterDuration = parseInt(remainingWaterDuration);

        let calculationTime = getQueryVariable("ct");
        if (calculationTime === null || !isInteger(calculationTime)) {
            return;
        }
        calculationTime = parseInt(calculationTime) * 1000;

        if (checkTimeInput(totalMaturityTime, remainingMaturityTime, remainingWaterDuration)) {
            generateWateringSuggestionFunction(
                totalMaturityTime, remainingMaturityTime, remainingWaterDuration, calculationTime
            );
            // 显示分享链接
            showShareLink();
        }
        // 将 URL 参数的值同步为 Select 选中的值
        document.getElementById("totalMaturityTimeSelect").value = totalMaturityTime + "";

        document.getElementById("remainingMaturityTimeDaySelect").value = parseInt(remainingMaturityTime / (24 * 60 * 60)) + "";
        document.getElementById("remainingMaturityTimeHourSelect").value = parseInt(remainingMaturityTime % (24 * 60 * 60) / (60 * 60)) + "";
        document.getElementById("remainingMaturityTimeMinuteSelect").value = parseInt(remainingMaturityTime % (60 * 60) / 60) + "";
        document.getElementById("remainingMaturityTimeSecondSelect").value = parseInt(remainingMaturityTime % 60) + "";
        
        document.getElementById("remainingWaterDurationHourSelect").value = parseInt(remainingWaterDuration / (60 * 60)) + "";
        document.getElementById("remainingWaterDurationMinuteSelect").value = parseInt(remainingWaterDuration % (60 * 60) / 60) + "";
        document.getElementById("remainingWaterDurationSecondSelect").value = parseInt(remainingWaterDuration % 60) + "";
    })();
});

