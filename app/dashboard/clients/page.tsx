'use client'


import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
type Client = {
  id: string,
  name : string,
  email : string,
  company: string 
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [editForm, setEditForm] = useState({ name: '', email: '', company: '' })

  useEffect(() => {
    const fetchData = async() =>{
        try {
            const response = await fetch('/api/clients')
            if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json()
            setClients(result)
            
        } catch (e) {
            throw new Error(`HTTP error! status: ${e}`);
        }finally{
            setLoading(false)
        }
    }
     fetchData()
  }, [])

  async function handleDelete(id: string) {
    const fetchData = await fetch(`/api/clients/${id}` , {
        method: 'DELETE'
    })
    if (!fetchData.ok) {
      throw new Error(`HTTP error! status: ${fetchData.status}`);
    }
    setClients(prev => prev.filter(item => item.id !== id))
  

  } 


   async function handleCreate(name: string, email: string, company: string) {
    const postClinet = {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify({name , email , company})
    }
    const postData = await fetch('/api/clients' , postClinet)
    if (!postData.ok) {
        throw new Error(`HTTP error! status: ${postData.status}`);
    }
    const newClient = await postData.json()
    setClients(prev => [...prev , newClient])
}
  async function handleUpdate(id: string, name: string, email: string, company: string) {
    const postData = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company }),
    })
    if (!postData.ok) throw new Error(`HTTP error! status: ${postData.status}`)
    setClients(prev => prev.map( c => c.id === id ?{...c , name , email , company} : c)) 
 setEditingId(null)   
  }

   function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ]

  function getAvatarColor(name: string) {
    const index = name.charCodeAt(0) % avatarColors.length
    return avatarColors[index]
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </p>
        </div>
        <Button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancel' : '+ Add client'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="john@acme.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleCreate(form.name, form.email, form.company)
                  setForm({ name: '', email: '', company: '' })
                  setShowForm(false)
                }}
              >
                Save client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          Loading clients...
        </div>
      )}

      {!loading && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-sm">No clients yet.</p>
          <p className="text-gray-400 text-xs mt-1">Add your first client to get started.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {clients.map(client => (
          <Card key={client.id}>
            <CardContent className="p-4">

              {editingId !== client.id ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(client.name)}`}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {client.email} {client.company && `· ${client.company}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(client.id)
                        setEditForm({
                          name: client.name,
                          email: client.email,
                          company: client.company,
                        })
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(client.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : ( 
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={editForm.email}
                        onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={editForm.company}
                        onChange={e => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdate(client.id, editForm.name, editForm.email, editForm.company)
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
 