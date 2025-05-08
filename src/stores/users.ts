import { defineStore } from 'pinia'
import dayjs from 'dayjs'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        role: '管理员',
        created_at: '2025-05-01T09:00:00+08:00',
      },
      {
        id: '2',
        username: '李娜',
        email: 'lina@example.com',
        password: 'password456',
        role: '操作员',
        created_at: '2025-05-02T10:00:00+08:00',
      },
      {
        id: '3',
        username: '王磊',
        email: 'wanglei@example.com',
        password: 'password789',
        role: '观察者',
        created_at: '2025-05-03T11:00:00+08:00',
      },
    ],
    isLoggedIn: false,
    currentUser: null,
  }),
  actions: {
    addUser(user) {
      const newUser = {
        ...user,
        id: String(this.users.length + 1),
        created_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss+08:00'),
      }
      this.users.push(newUser)
    },
    editUser(updatedUser) {
      const index = this.users.findIndex((user) => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = {
          ...updatedUser,
          created_at: this.users[index].created_at, // 保留原始创建时间
        }
      }
    },
    deleteUser(id) {
      this.users = this.users.filter((user) => user.id !== id)
    },
    login({ username, password }) {
      const user = this.users.find((u) => u.username === username && u.password === password)
      if (user) {
        this.isLoggedIn = true
        this.currentUser = { ...user }
        return true
      }
      return false
    },
    logout() {
      this.isLoggedIn = false
      this.currentUser = null
    },
  },
  getters: {
    getUsers:
      (state) =>
      (filters = {}) => {
        let filteredUsers = state.users
        if (filters.username) {
          filteredUsers = filteredUsers.filter((user) =>
            user.username.toLowerCase().includes(filters.username.toLowerCase()),
          )
        }
        if (filters.role) {
          filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
        }
        return filteredUsers.map((user) => ({
          ...user,
          created_at: dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
        }))
      },
  },
})
