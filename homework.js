// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
	const res = await fetch(url);
	const data = await res.json();
	return data.products;
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const res = await fetch(url);
	const data = await res.json();
	const cartData = {
		carts: data.carts,
		total: data.total,
		finalTotal: data.finalTotal,
	};
	return cartData;
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`錯誤狀態： ${res.status}`);
		}
		const data = await res.json();
		return { success: true, data: data.products };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const headers = {
		"Content-Type": "application/json",
	};
	const body = JSON.stringify({
		data: {
			productId,
			quantity,
		},
	});
	const res = await fetch(url, {
		method: "POST",
		headers,
		body
	});
	const data = await res.json();
	return data;
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const headers = {
		"Content-Type": "application/json",
	};
	const body = JSON.stringify({
		data: {
			id: cartId,
			quantity,
		},
	});
	const res = await fetch(url, {
		method: "PATCH",
		headers,
		body
	});
	const data = await res.json();
	return data;
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`;
	const res = await fetch(url, {
		method: "DELETE",
	});
	const data = await res.json();
	return data;
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const res = await fetch(url, {
		method: "DELETE",
	});
	const data = await res.json();
	return data;
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
   1xx：資訊回應
   2xx：成功
   3xx：重定向
   4xx：客戶端錯誤
   5xx：伺服器錯誤

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   GET：用於取得資源，不會修改伺服器資料
   POST：用於建立資源，會修改伺服器資料
   PATCH：用於部分更新資源，會修改伺服器資料
   PUT：用於完全替換資源，會修改伺服器資料
   DELETE：用於刪除資源，會修改伺服器資料

3. 什麼是 RESTful API？
   答：
   RESTful API 是一種設計風格，強調使用 HTTP 方法（GET, POST, PATCH, DELETE）來操作資源，並且資源以 URL 表示。
   具有無狀態（Stateless）、統一介面接口、前後端分離的特性、可緩存等原則，是現代 Web 服務溝通的主流標準，能提升系統的擴展性與維護性。


*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
