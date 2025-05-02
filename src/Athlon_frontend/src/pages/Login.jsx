import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import { Navigate, useNavigate } from 'react-router-dom'
export default function Login() {
    const { isAuthenticated ,login } = useAuth()
    const navigate = useNavigate()
    if(isAuthenticated) navigate("/")

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md flex flex-col gap-4 rounded-lg text-center border border-gray-200 bg-white p-8 shadow-sm">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 ">Login</h1>
                    <p className="text-gray-500">Silahkan login dengan internet identity, terimakasih</p>
                </div>

                <Button
                    type="submit"
                    onClick={login}
                    className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
                >
                    Login sekarang
                </Button>

                {/* <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                </div> */}
            </div>
        </div>
    )
}
