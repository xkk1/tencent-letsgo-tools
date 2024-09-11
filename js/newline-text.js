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
document.addEventListener('DOMContentLoaded', () => {
    // 换行文本生成按钮
    document.getElementById('generate-button').addEventListener('click', () => {
        // 获取输入文本
        let text = document.getElementById('input-text-field').value;
        // text = text.trim();
        if (text.length == 0) {
            mdui.alert({
                headline: "输入文本为空",
                description: "请在上方文本框中输入换行的文本",
                confirmText: "确定"
            });
            return;
        }
        let newlineChar = "\u2028"; // default line 默认行分隔符
        let newlineRadiosElement = document.getElementById('newline-radios');
        if (newlineRadiosElement.value === "paragraph-separators") {
            // 换行符为段落分隔符
            newlineChar = "\u2029";
        }
        // 生成换行文本
        let newlineText = text.replaceAll("\n", newlineChar);
        // 显示结果
        let resultTextFieldElement = document.getElementById('result-text-field');
        resultTextFieldElement.value = newlineText;
        resultTextFieldElement.style.display = "block";
        resultTextFieldElement.select();
        // 复制到剪贴板
        utilities.copyText(newlineText);
        mdui.snackbar({
            message: "已复制到剪贴板，请前往元梦之星粘贴",
            placement: "top",
            autoCloseDelay: 3000,
            closeable: true
        });
    });
});