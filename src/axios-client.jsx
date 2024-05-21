import axios from "axios";

const axiosClient = axios.create({
    baseURL: `http://127.0.0.1:8000/api`,
    headers: {
      'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((response)=> {
    return response;
    }, 
    (error) => {
        try {
            const {response} = error;
            if (response.status === 401) {
                localStorage.removeItem('access_token');
            }
        } catch (error) {
            console.error(error);
        }

        throw error;
    }
)


export default axiosClient;