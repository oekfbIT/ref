class ApiService {
    constructor() {
        this.baseURL = "https://api.oekfb.eu/";
        // this.baseURL = "http://localhost:8080";
    }

    async request(method, endpoint, body = null, headers = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            credentials: 'include'
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        // Debugging log to print the request details
        console.log(`Request Method: ${method}`);
        console.log(`Request URL: ${url}`);
        if (body) {
            console.log('Request Body:', JSON.stringify(body, null, 2));
        }
        console.log('Request Headers:', JSON.stringify(options.headers, null, 2));

        try {
            const response = await fetch(url, options);
            const text = await response.text();

            if (response.ok) {
                try {
                    const jsonResponse = JSON.parse(text);
                    console.log('Response:', JSON.stringify(jsonResponse, null, 2));
                    return jsonResponse;
                } catch (e) {
                    console.log('Response:', text);
                    return text; // Return as text if it's not valid JSON
                }
            } else {
                const errorData = JSON.parse(text);
                console.log('Response Error:', JSON.stringify(errorData, null, 2));
                throw new Error(errorData.message || 'Request failed');
            }
        } catch (error) {
            console.error(`Error with ${method} request to ${endpoint}:`, error);
            throw error;
        }
    }

    async get(endpoint, headers = {}) {
        console.log(`GET Request to: ${endpoint}`);
        const response = await this.request('GET', endpoint, null, headers);
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
    }

    async post(endpoint, body, headers = {}) {
        console.log(`POST Request to: ${endpoint}`);
        console.log('Request Body:', JSON.stringify(body, null, 2));
        const response = await this.request('POST', endpoint, body, headers);
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
    }

    async patch(endpoint, body, headers = {}) {
        console.log(`PATCH Request to: ${endpoint}`);
        console.log('Request Body:', JSON.stringify(body, null, 2));
        const response = await this.request('PATCH', endpoint, body, headers);
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
    }

    async delete(endpoint, headers = {}) {
        console.log(`DELETE Request to: ${endpoint}`);
        const response = await this.request('DELETE', endpoint, null, headers);
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
    }
}

export default ApiService;
