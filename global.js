function copyToClipboard(text) {
	const el = document.createElement('textarea')
	el.value = text
	el.setAttribute('readonly', '')
	el.style.position = 'absolute'
	el.style.left = '-9999px'
	document.body.appendChild(el)

	const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false

	el.select()
	el.setSelectionRange(0, text.length)
	document.execCommand('copy')
	document.body.removeChild(el)

	if (selected) {
		document.getSelection().removeAllRanges()
		document.getSelection().addRange(selected)
	}
}
class RestClient {
	constructor(apiUrl, bearerToken) {
		this.apiUrl = apiUrl
		this.bearerToken = bearerToken
	}

	async get(endpoint) {
		const url = `${this.apiUrl}/${endpoint}`

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.bearerToken}`,
				},
			})

			if (response.status === 400) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			} else if (response.status === 401) {
				throw { status: response.status, message: 'Unauthorized' }
			} else if (response.status === 404) {
				throw { status: response.status, message: 'Not Found' }
			}

			if (!response.ok) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Ошибка при выполнении GET-запроса:', error)
			throw error
		}
	}

	async post(endpoint, body) {
		const url = `${this.apiUrl}/${endpoint}`

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.bearerToken}`,
				},
				body: JSON.stringify(body),
			})

			if (response.status === 400) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			} else if (response.status === 401) {
				throw { status: response.status, message: 'Unauthorized' }
			} else if (response.status === 404) {
				throw { status: response.status, message: 'Not Found' }
			}

			if (!response.ok) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Ошибка при выполнении POST-запроса:', error)
			throw error
		}
	}
	async postBinary(endpoint, formData) {
		const url = `${this.apiUrl}/${endpoint}`

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${this.bearerToken}`,
				},
				body: formData,
			})

			if (response.status === 400) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			} else if (response.status === 401) {
				throw { status: response.status, message: 'Unauthorized' }
			} else if (response.status === 404) {
				throw { status: response.status, message: 'Not Found' }
			}

			if (!response.ok) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Ошибка при выполнении POST-запроса:', error)
			throw error
		}
	}

	async delete(endpoint) {
		const url = `${this.apiUrl}`

		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					accept: '*/*',
					Authorization: `Bearer ${this.bearerToken}`,
				},
			})

			if (response.status === 400) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			} else if (response.status === 401) {
				throw { status: response.status, message: 'Unauthorized' }
			} else if (response.status === 404) {
				throw { status: response.status, message: 'Not Found' }
			}

			if (!response.ok) {
				throw { status: response.status, message: errorData }
			}

			return
		} catch (error) {
			console.error('Ошибка при выполнении DELETE-запроса:', error)
			throw error
		}
	}

	async patch(endpoint, body) {
		const url = `${this.apiUrl}/${endpoint}`

		try {
			const response = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.bearerToken}`,
				},
				body: JSON.stringify(body),
			})

			if (response.status === 400) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			} else if (response.status === 401) {
				throw { status: response.status, message: 'Unauthorized' }
			} else if (response.status === 404) {
				throw { status: response.status, message: 'Not Found' }
			}

			if (!response.ok) {
				const errorData = await response.json()
				throw { status: response.status, message: errorData }
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Ошибка при выполнении PATCH-запроса:', error)
			throw error
		}
	}
}

class DashboardService {
	constructor() {
		const bearerToken = localStorage.getItem('_ms-mid') ?? ''
		const baseUrl = 'https://atrium-prod-api.optic.xyz/aion/users'
		this.client = new RestClient(baseUrl, bearerToken)
	}

	static getInstance() {
		if (!DashboardService.instance) {
			DashboardService.instance = new DashboardService()
		}
		return DashboardService.instance
	}

	static async fetchRequests(offset = 0, limit = 10) {
		try {
			const client = DashboardService.getInstance().client
			const endpoint = `data?filters=requests&offset=${offset}&limit=${limit}`
			return await client.get(endpoint).then((data) => data.requests.array)
		} catch (error) {
			console.error('Ошибка getRequests:', error)
			return []
		}
	}

	static async fetchUsageApi() {
		try {
			const client = DashboardService.getInstance().client
			const endpoint = `data?filters=api&offset=0&limit=10`
			return await client.get(endpoint).then((data) => data.api)
		} catch (error) {
			console.error('Ошибка fetchUsageApi:', error)
			return []
		}
	}

	static async signUp() {
		try {
			const client = DashboardService.getInstance().client
			return await client
				.post('sign_up')
				.then((data) => false)
				.catch((error) => {
					if (error.status === 400) {
						return true
					}
					throw error
				})
		} catch (error) {
			console.console.error('Ошибка signUp:', error)
		}
	}

	static async login() {
		try {
			const client = DashboardService.getInstance().client
			return await client.get('login')
		} catch (error) {
			console.console.error('Ошибка login:', error)
		}
	}

	static async delete() {
		try {
			const client = DashboardService.getInstance().client
			AuthService.removeAuth()
			return await client.delete('')
		} catch (error) {
			console.console.error('Ошибка delete:', error)
		}
	}

	static async fetchApiToken() {
		try {
			const client = DashboardService.getInstance().client
			return await client.post('api_token')
		} catch (error) {
			console.console.error('Ошибка fetchApiToken:', error)
		}
	}

	static async refreshApiToken() {
		try {
			const client = DashboardService.getInstance().client
			return await client.patch('api_token')
		} catch (error) {
			console.console.error('Ошибка fetchApiToken:', error)
		}
	}
}

class AIGeneratedService {
	constructor() {
		const bearerToken = localStorage.getItem('_ms-mid') ?? ''
		const baseUrl = 'https://atrium-prod-api.optic.xyz/aion/ai-generated'
		this.client = new RestClient(baseUrl, bearerToken)
	}

	static getInstance() {
		if (!AIGeneratedService.instance) {
			AIGeneratedService.instance = new AIGeneratedService()
		}
		return AIGeneratedService.instance
	}

	static async getReportsByBinary(file) {
		const client = AIGeneratedService.getInstance().client

		try {
			const formData = new FormData()
			formData.append('binary', file, 'uploaded-file.png')
			return await client.postBinary('reports/binary', formData)
		} catch (error) {
			console.error('Error getReportsByBinary:', error)
		}
	}

	static async getReportsByUrl(url) {
		const client = AIGeneratedService.getInstance().client

		try {
			const endpoint = `reports/url?url=${url}`
			return await client.post(endpoint, {})
		} catch (error) {
			console.error('Ошибка getReportsByUrl:', error)
		}
	}
}

class OpenAIGeneratedService {
	constructor() {}

	static async getReportsByBinary(file, visitorId) {
		const baseUrl = `https://atrium-prod-api.optic.xyz/results/api/detector/reports/raw?source=web&user_id=${visitorId}`
		const formData = new FormData()
		formData.append('binary', file, 'file_name.png')

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${localStorage.getItem('_ms-mid') ?? ''}`,
			},
			body: formData,
		}

		return await fetch(baseUrl, options).then((response) => response.json())
	}

	static async getReportsByUrl(url, visitorId) {
		const baseUrl = `https://atrium-prod-api.optic.xyz/results/api/detector/reports/json?source=web&user_id=${visitorId}`

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('_ms-mid') ?? ''}`,
			},
			body: JSON.stringify({
				object: url,
			}),
		}

		return await fetch(baseUrl, options).then((response) => response.json())
	}

	static async sendFeedback(id, reportPredict, reportComment) {
		const body = {
			is_proper_predict: reportPredict,
			comment: reportComment,
		}

		let url = `https://atrium-prod-api.optic.xyz/results/api/detector/reports/result/${id}`
		let options = {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}

		const isUserAuthorized = localStorage.getItem('_ms-mid') ? true : false
		if (isUserAuthorized) {
			url = `https://atrium-prod-api.optic.xyz/aion/ai-generated/reports/${id}`
			options = {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			}
		}

		await fetch(url, options)
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error))
	}
}

class WrapperAIGeneratedService {
	static async getReportsByBinary(file, visitorId) {
		if (localStorage.getItem('_ms-mid') !== null) {
			return await AIGeneratedService.getReportsByBinary(file)
		} else {
			return await OpenAIGeneratedService.getReportsByBinary(file, visitorId)
		}
	}
	static async getReportsByUrl(url, visitorId) {
		if (localStorage.getItem('_ms-mid') !== null) {
			return await AIGeneratedService.getReportsByUrl(url)
		} else {
			return await OpenAIGeneratedService.getReportsByUrl(url, visitorId)
		}
	}

	static async sendFeedback(id, reportPredict, reportComment) {
		return await OpenAIGeneratedService.sendFeedback(id, reportPredict, reportComment)
	}
}

class RequestCounter {
	static key = 'requestCount'

	constructor() {}

	static isLimitExceeded() {
		if (localStorage.getItem('_ms-mid') !== null) {
			return false
		}

		const count = localStorage.getItem(RequestCounter.key)
		if (count === null) {
			return false
		}

		return count > 5
	}

	static increment() {
		const count = localStorage.getItem(RequestCounter.key)
		const newCount = count === null ? 1 : Number(count) + 1
		localStorage.setItem(RequestCounter.key, newCount)
	}
}

class AuthService {
	static key = 'isSignUp'

	constructor() {}

	static isAuth() {
		if (localStorage.getItem(AuthService.key) !== null) {
			return true
		}

		return false
	}

	static setAuth() {
		localStorage.setItem(AuthService.key, 'true')
	}

	static removeAuth() {
		localStorage.removeItem(AuthService.key)
	}

	static async init() {
		if (AuthService.isAuth()) {
			await DashboardService.login()
		} else {
			await DashboardService.signUp()
			AuthService.setAuth()
			await DashboardService.login()
		}
	}
}

class ElementCreator {
	static fillGridResults(elementId, array) {
		const results = document.getElementById(elementId)
		results.style.display = 'grid'
		array.forEach((item) => {
			let requestItem = document.createElement('div')
			requestItem.classList.add('request-item')
			let verdict = document.createElement('div')
			verdict.classList.add('request-item-verdict')
			verdict.innerText = item.verdict
			let image = document.createElement('img')
			image.src = item.url
			image.alt = item.verdict
			ElementCreator.fillCardControls(requestItem, item)
			requestItem.appendChild(image)
			requestItem.appendChild(verdict)
			results.appendChild(requestItem)
		})
	}

	static fillApiKeyCard(data) {
		const formattedDate = (dateStr) => {
			const date = new Date(dateStr)
			const options = {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			}
			return date.toLocaleDateString('en-US', options)
		}

		const apiKeyCard = document.getElementById('api-item')
		// const nameApiKey = document.getElementById('name-api-key')
		// const lastUsed = document.getElementById('last-used')
		const expireDate = document.getElementById('expire-date')
		const rps = document.getElementById('rps')
		const progressLine = document.getElementById('progress-line')
		const counterRequests = document.getElementById('counter-requests')
		const totalEequests = document.getElementById('total-requests')

		// nameApiKey.innerText = data?.name ?? 'Empty'
		// lastUsed.innerText = data?.last_used ?? 'Empty'
		expireDate.innerText = formattedDate(data?.expiration_dt)
		rps.innerText = data.limits.secondly
		progressLine.style.width = `${(data.usage.daily / data.limits.daily) * 100}%`
		console.log((data.usage.daily / data.limits.daily) * 100)
		counterRequests.innerText = data.usage.daily
		totalEequests.innerText = data.limits.daily

		apiKeyCard.style.display = 'flex'

		document.getElementById('api-copy').onclick = () => {
			copyToClipboard(data.key)
		}
	}

	static fillCardControls(parentElement, item) {
		let shareButton = document.createElement('button')
		shareButton.onclick = () => {
			shareButton.innerText = 'Copied!'
			copyToClipboard(`https://results.aiornot.com/aiornot/users/${item.id}`)
			setTimeout(() => {
				shareButton.innerText = 'Share'
			}, 1500)
		}
		shareButton.innerText = 'Share'
		shareButton.classList.add('request-item-share')
		shareButton.style.opacity = 0

		if (!item.hasOwnProperty('is_proper_predict')) {
			let controlsContainer = document.createElement('div')
			controlsContainer.id = 'request-item-controls'
			controlsContainer.style.display = 'none'

			let likeButton = document.createElement('button')
			likeButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.2 6.71995C14.0127 6.49505 13.7782 6.314 13.5133 6.1896C13.2484 6.06519 12.9593 6.00045 12.6666 5.99995H9.62665L9.99998 5.04662C10.1553 4.6292 10.207 4.18035 10.1507 3.73856C10.0944 3.29677 9.93177 2.87523 9.67677 2.5101C9.42177 2.14497 9.082 1.84715 8.68661 1.64218C8.29121 1.43721 7.852 1.33121 7.40665 1.33328C7.27841 1.33355 7.15296 1.3708 7.04536 1.44056C6.93776 1.51033 6.85256 1.60965 6.79998 1.72661L4.89998 5.99995H3.33331C2.80288 5.99995 2.29417 6.21066 1.9191 6.58573C1.54403 6.96081 1.33331 7.46952 1.33331 7.99995V12.6666C1.33331 13.197 1.54403 13.7058 1.9191 14.0808C2.29417 14.4559 2.80288 14.6666 3.33331 14.6666H11.82C12.2879 14.6665 12.7409 14.5023 13.1002 14.2026C13.4595 13.903 13.7024 13.4868 13.7866 13.0266L14.6333 8.35995C14.6857 8.07154 14.674 7.77514 14.5991 7.49173C14.5242 7.20833 14.388 6.94485 14.2 6.71995ZM4.66665 13.3333H3.33331C3.1565 13.3333 2.98693 13.263 2.86191 13.138C2.73688 13.013 2.66665 12.8434 2.66665 12.6666V7.99995C2.66665 7.82314 2.73688 7.65357 2.86191 7.52854C2.98693 7.40352 3.1565 7.33328 3.33331 7.33328H4.66665V13.3333ZM13.3333 8.11995L12.4866 12.7866C12.4582 12.9419 12.3757 13.0821 12.2536 13.1822C12.1315 13.2823 11.9778 13.3359 11.82 13.3333H5.99998V6.80662L7.81331 2.72662C7.99997 2.78103 8.17332 2.87355 8.32242 2.99834C8.47152 3.12312 8.59313 3.27746 8.67958 3.45161C8.76603 3.62576 8.81543 3.81594 8.82468 4.01015C8.83393 4.20436 8.80282 4.39837 8.73331 4.57995L8.37998 5.53328C8.30469 5.73479 8.27927 5.95151 8.3059 6.16497C8.33252 6.37843 8.41039 6.58227 8.53287 6.75911C8.65535 6.93595 8.81879 7.08053 9.00925 7.18051C9.19971 7.28049 9.41154 7.33291 9.62665 7.33328H12.6666C12.7646 7.33312 12.8614 7.35455 12.9501 7.39603C13.0388 7.43751 13.1173 7.49803 13.18 7.57328C13.2442 7.6475 13.2912 7.73498 13.3178 7.82948C13.3443 7.92397 13.3496 8.02316 13.3333 8.11995Z" fill="#ADFF00"/>
				</svg>
				`

			let dislikeButton = document.createElement('button')
			dislikeButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.6667 1.33337H4.17998C3.71211 1.33353 3.2591 1.49771 2.89977 1.79736C2.54044 2.097 2.29754 2.51314 2.21332 2.97337L1.36665 7.64004C1.3139 7.92833 1.32515 8.2247 1.39961 8.50816C1.47407 8.79162 1.60992 9.05526 1.79754 9.28041C1.98517 9.50556 2.21998 9.68672 2.48537 9.81108C2.75076 9.93543 3.04024 9.99994 3.33332 10H6.37332L5.99998 10.9534C5.8447 11.3708 5.79298 11.8196 5.84928 12.2614C5.90557 12.7032 6.06819 13.1248 6.32319 13.4899C6.5782 13.855 6.91797 14.1528 7.31336 14.3578C7.70875 14.5628 8.14796 14.6688 8.59332 14.6667C8.72156 14.6664 8.847 14.6292 8.9546 14.5594C9.06221 14.4897 9.14741 14.3903 9.19999 14.2734L11.1 10H12.6667C13.1971 10 13.7058 9.78933 14.0809 9.41426C14.4559 9.03918 14.6667 8.53047 14.6667 8.00004V3.33337C14.6667 2.80294 14.4559 2.29423 14.0809 1.91916C13.7058 1.54409 13.1971 1.33337 12.6667 1.33337ZM9.99998 9.19337L8.18665 13.2734C8.00111 13.2172 7.82903 13.1237 7.68101 12.9985C7.53299 12.8734 7.41216 12.7192 7.32597 12.5456C7.23978 12.372 7.19006 12.1825 7.17985 11.989C7.16965 11.7954 7.19919 11.6018 7.26665 11.42L7.61999 10.4667C7.69527 10.2652 7.72069 10.0485 7.69407 9.83502C7.66745 9.62156 7.58957 9.41772 7.4671 9.24088C7.34462 9.06404 7.18118 8.91946 6.99071 8.81948C6.80025 8.7195 6.58843 8.66708 6.37332 8.66671H3.33332C3.23538 8.66687 3.13861 8.64544 3.04988 8.60396C2.96116 8.56248 2.88267 8.50196 2.81998 8.42671C2.75576 8.35249 2.70872 8.26501 2.68221 8.17051C2.65571 8.07601 2.65039 7.97683 2.66665 7.88004L3.51332 3.21337C3.54172 3.05807 3.62431 2.91788 3.74639 2.81777C3.86848 2.71767 4.02213 2.66413 4.17998 2.66671H9.99998V9.19337ZM13.3333 8.00004C13.3333 8.17685 13.2631 8.34642 13.1381 8.47145C13.013 8.59647 12.8435 8.66671 12.6667 8.66671H11.3333V2.66671H12.6667C12.8435 2.66671 13.013 2.73695 13.1381 2.86197C13.2631 2.98699 13.3333 3.15656 13.3333 3.33337V8.00004Z" fill="#FF4651"/>
				</svg>
				`

			likeButton.onclick = () => {
				let feedbackAlert = document.createElement('div')
				feedbackAlert.classList.add('feedback-alert')
				feedbackAlert.classList.add('feedback-alert__correct')
				feedbackAlert.innerHTML = `
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M14.2 6.71995C14.0127 6.49505 13.7782 6.314 13.5133 6.1896C13.2484 6.06519 12.9593 6.00045 12.6666 5.99995H9.62665L9.99998 5.04662C10.1553 4.6292 10.207 4.18035 10.1507 3.73856C10.0944 3.29677 9.93177 2.87523 9.67677 2.5101C9.42177 2.14497 9.082 1.84715 8.68661 1.64218C8.29121 1.43721 7.852 1.33121 7.40665 1.33328C7.27841 1.33355 7.15296 1.3708 7.04536 1.44056C6.93776 1.51033 6.85256 1.60965 6.79998 1.72661L4.89998 5.99995H3.33331C2.80288 5.99995 2.29417 6.21066 1.9191 6.58573C1.54403 6.96081 1.33331 7.46952 1.33331 7.99995V12.6666C1.33331 13.197 1.54403 13.7058 1.9191 14.0808C2.29417 14.4559 2.80288 14.6666 3.33331 14.6666H11.82C12.2879 14.6665 12.7409 14.5023 13.1002 14.2026C13.4595 13.903 13.7024 13.4868 13.7866 13.0266L14.6333 8.35995C14.6857 8.07154 14.674 7.77514 14.5991 7.49173C14.5242 7.20833 14.388 6.94485 14.2 6.71995ZM4.66665 13.3333H3.33331C3.1565 13.3333 2.98693 13.263 2.86191 13.138C2.73688 13.013 2.66665 12.8434 2.66665 12.6666V7.99995C2.66665 7.82314 2.73688 7.65357 2.86191 7.52854C2.98693 7.40352 3.1565 7.33328 3.33331 7.33328H4.66665V13.3333ZM13.3333 8.11995L12.4866 12.7866C12.4582 12.9419 12.3757 13.0821 12.2536 13.1822C12.1315 13.2823 11.9778 13.3359 11.82 13.3333H5.99998V6.80662L7.81331 2.72662C7.99997 2.78103 8.17332 2.87355 8.32242 2.99834C8.47152 3.12312 8.59313 3.27746 8.67958 3.45161C8.76603 3.62576 8.81543 3.81594 8.82468 4.01015C8.83393 4.20436 8.80282 4.39837 8.73331 4.57995L8.37998 5.53328C8.30469 5.73479 8.27927 5.95151 8.3059 6.16497C8.33252 6.37843 8.41039 6.58227 8.53287 6.75911C8.65535 6.93595 8.81879 7.08053 9.00925 7.18051C9.19971 7.28049 9.41154 7.33291 9.62665 7.33328H12.6666C12.7646 7.33312 12.8614 7.35455 12.9501 7.39603C13.0388 7.43751 13.1173 7.49803 13.18 7.57328C13.2442 7.6475 13.2912 7.73498 13.3178 7.82948C13.3443 7.92397 13.3496 8.02316 13.3333 8.11995Z" fill="#10151D"/>
						</svg>
						<span>Correct</span>
					`

				controlsContainer.remove()
				parentElement.appendChild(feedbackAlert)
				setTimeout(() => {
					feedbackAlert.remove()
				}, 5000)

				WrapperAIGeneratedService.sendFeedback(item.id, true, '')
			}

			dislikeButton.onclick = () => {
				let feedbackAlert = document.createElement('div')
				feedbackAlert.classList.add('feedback-alert')
				feedbackAlert.classList.add('feedback-alert__incorrect')
				feedbackAlert.innerHTML = `
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12.6667 1.33337H4.17998C3.71211 1.33353 3.2591 1.49771 2.89977 1.79736C2.54044 2.097 2.29754 2.51314 2.21332 2.97337L1.36665 7.64004C1.3139 7.92833 1.32515 8.2247 1.39961 8.50816C1.47407 8.79162 1.60992 9.05526 1.79754 9.28041C1.98517 9.50556 2.21998 9.68672 2.48537 9.81108C2.75076 9.93543 3.04024 9.99994 3.33332 10H6.37332L5.99998 10.9534C5.8447 11.3708 5.79298 11.8196 5.84928 12.2614C5.90557 12.7032 6.06819 13.1248 6.32319 13.4899C6.5782 13.855 6.91797 14.1528 7.31336 14.3578C7.70875 14.5628 8.14796 14.6688 8.59332 14.6667C8.72156 14.6664 8.847 14.6292 8.9546 14.5594C9.06221 14.4897 9.14741 14.3903 9.19999 14.2734L11.1 10H12.6667C13.1971 10 13.7058 9.78933 14.0809 9.41426C14.4559 9.03918 14.6667 8.53047 14.6667 8.00004V3.33337C14.6667 2.80294 14.4559 2.29423 14.0809 1.91916C13.7058 1.54409 13.1971 1.33337 12.6667 1.33337ZM9.99998 9.19337L8.18665 13.2734C8.00111 13.2172 7.82903 13.1237 7.68101 12.9985C7.53299 12.8734 7.41216 12.7192 7.32597 12.5456C7.23978 12.372 7.19006 12.1825 7.17985 11.989C7.16965 11.7954 7.19919 11.6018 7.26665 11.42L7.61999 10.4667C7.69527 10.2652 7.72069 10.0485 7.69407 9.83502C7.66745 9.62156 7.58957 9.41772 7.4671 9.24088C7.34462 9.06404 7.18118 8.91946 6.99071 8.81948C6.80025 8.7195 6.58843 8.66708 6.37332 8.66671H3.33332C3.23538 8.66687 3.13861 8.64544 3.04988 8.60396C2.96116 8.56248 2.88267 8.50196 2.81998 8.42671C2.75576 8.35249 2.70872 8.26501 2.68221 8.17051C2.65571 8.07601 2.65039 7.97683 2.66665 7.88004L3.51332 3.21337C3.54172 3.05807 3.62431 2.91788 3.74639 2.81777C3.86848 2.71767 4.02213 2.66413 4.17998 2.66671H9.99998V9.19337ZM13.3333 8.00004C13.3333 8.17685 13.2631 8.34642 13.1381 8.47145C13.013 8.59647 12.8435 8.66671 12.6667 8.66671H11.3333V2.66671H12.6667C12.8435 2.66671 13.013 2.73695 13.1381 2.86197C13.2631 2.98699 13.3333 3.15656 13.3333 3.33337V8.00004Z" fill="#10151D"/>
						</svg>
						<span>Incorrect</span>
					`

				controlsContainer.remove()
				parentElement.appendChild(feedbackAlert)
				setTimeout(() => {
					feedbackAlert.remove()
				}, 5000)

				WrapperAIGeneratedService.sendFeedback(item.id, false, '')
			}

			controlsContainer.appendChild(likeButton)
			controlsContainer.appendChild(dislikeButton)

			parentElement.appendChild(controlsContainer)
		}

		parentElement.appendChild(shareButton)
	}
}
