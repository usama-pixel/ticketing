'use client';
import axios from "axios"
import { useState } from "react"

export default function useRequest ({url, method, body, onSuccess}) {
    const [errors, setErrors] = useState(null)
    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const response = await axios[method](url, {...body, ...props})
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data
        } catch(err) {
            setErrors(
                <div className='bg-red-300 text-red-950 py-3'>
                    <h4 className=''>Ooops...</h4>
                    <ul className='my-1'>
                      {err?.response?.data?.errors?.map((err, i) => <li key={i}>{err.message}</li>)}
                    </ul>
                </div>
            )
        }
    }
    return {doRequest, errors}
}