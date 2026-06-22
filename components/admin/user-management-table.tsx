"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Mail, Phone, Plus, Shield, UserCheck, Trash2 } from "lucide-react"
import { LocalDB } from "@/lib/local-storage/db"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"

interface User {
  id: string
  full_name: string
  email: string
  role: string
  phone: string | null
  created_at: string
}

interface UserManagementTableProps {
  users: User[]
  onDelete?: (id: string) => Promise<void> | void
  onToggleRole?: (id: string) => Promise<void> | void
}

export function UserManagementTable({ users, onDelete, onToggleRole }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Local add user form state
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("investor")
  const [creating, setCreating] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const createUser = async () => {
    try {
      if (!newEmail || !newPassword || !newName) return toast({ title: "Missing fields", description: "Please fill name, email and password" })
      setCreating(true)
      await LocalDB.createUser(newEmail, newPassword, newName, newRole as any)
      toast({ title: "User created", description: `${newName} was added.` })
      // reset form
      setNewName("")
      setNewEmail("")
      setNewPassword("")
      setNewRole("investor")
      // reload to pick up user in parent lists
      setTimeout(() => window.location.reload(), 300)
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || "Failed to create user" })
    } finally {
      setCreating(false)
    }
  }

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
      case "investor":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Search className="h-5 w-5 text-cyan-600" />
            Search Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10 border-cyan-200 dark:border-cyan-800 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add User Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Plus className="h-5 w-5 text-blue-600" />
            Add New User
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-5">
            <Input
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-blue-200 dark:border-blue-800"
            />
            <Input
              placeholder="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border-blue-200 dark:border-blue-800"
            />
            <Input
              placeholder="Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-blue-200 dark:border-blue-800"
            />
            <Select value={newRole} onValueChange={(v) => setNewRole(v)}>
              <SelectTrigger className="border-blue-200 dark:border-blue-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investor">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={createUser}
              disabled={creating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Adding..." : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table Card */}
      <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 pb-4">
          <CardTitle className="text-gray-900 dark:text-white">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-800">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Joined</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors duration-200 animate-in fade-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4 font-semibold text-gray-900 dark:text-white">{user.full_name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4 text-blue-500" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getRoleBadgeStyles(user.role)} flex items-center gap-1 w-fit`}>
                          {user.role === "admin" ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <UserCheck className="h-3 w-3" />
                          )}
                          {user.role.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {user.phone ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="h-4 w-4 text-green-500" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(user.created_at)}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={togglingId === user.id}
                            className="border-cyan-300 dark:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 transition-all duration-200"
                            onClick={async () => {
                              try {
                                setTogglingId(user.id)
                                if (onToggleRole) {
                                  await onToggleRole(user.id)
                                  toast({ title: "Role updated" })
                                  setTogglingId(null)
                                  return
                                }

                                // Fallback: toggle between admin and investor in localStorage
                                const users = JSON.parse(localStorage.getItem("users") || "[]") as any[]
                                const idx = users.findIndex((u) => u.id === user.id)
                                if (idx === -1) return
                                users[idx].role = users[idx].role === "admin" ? "investor" : "admin"
                                localStorage.setItem("users", JSON.stringify(users))
                                toast({ title: "Role updated" })
                                // simple page refresh to pick up change
                                setTimeout(() => window.location.reload(), 200)
                              } catch (e) {
                                console.error(e)
                                toast({ title: "Update failed", description: "Could not toggle role" })
                              } finally {
                                setTogglingId(null)
                              }
                            }}
                          >
                            {togglingId === user.id ? "Updating..." : "Toggle Role"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === user.id}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white gap-2 transition-all duration-200"
                            onClick={async () => {
                              try {
                                setDeletingId(user.id)
                                if (onDelete) {
                                  await onDelete(user.id)
                                  toast({ title: "User deleted" })
                                  setDeletingId(null)
                                  return
                                }

                                // Fallback delete: remove from localStorage users array
                                const users = JSON.parse(localStorage.getItem("users") || "[]") as any[]
                                const filtered = users.filter((u) => u.id !== user.id)
                                localStorage.setItem("users", JSON.stringify(filtered))
                                toast({ title: "User deleted" })
                                setTimeout(() => window.location.reload(), 200)
                              } catch (e) {
                                console.error(e)
                                toast({ title: "Delete failed", description: "Could not delete user" })
                              } finally {
                                setDeletingId(null)
                              }
                            }}
                          >
                            {deletingId === user.id ? "Deleting..." : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mb-4 text-4xl">👥</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
