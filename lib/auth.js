"use client"

import { account } from "./appwrite"
import { ID } from "appwrite"

export class AuthService {
    // Get current user session
    async getCurrentUser() {
        try {
            const user = await account.get()
            return user
        } catch (error) {
            console.error("Error getting current user:", error)
            return null
        }
    }

    // Login with email and password
    async login(email, password) {
        try {
            await account.createEmailPasswordSession(email, password)
            return await this.getCurrentUser()
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    // Register new user
    async register(email, password, name) {
        try {
            await account.create(ID.unique(), email, password, name)
            return await this.login(email, password)
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    }

    // Logout
    async logout() {
        try {
            await account.deleteSession("current")
        } catch (error) {
            console.error("Logout error:", error)
            throw error
        }
    }

    // Update user preferences
    async updatePrefs(prefs) {
        try {
            return await account.updatePrefs(prefs)
        } catch (error) {
            console.error("Update preferences error:", error)
            throw error
        }
    }
}

export const authService = new AuthService()
