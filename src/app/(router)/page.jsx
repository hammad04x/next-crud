"use client"
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"

export default function page() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/users");
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      alert("DONE")
      fetchData()
    } catch (error) {
      console.error(error);
      alert("FAILED")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="mx-10">
      <div className="flex justify-between items-center my-5 ">
        <h1> USERS LIST</h1>
        <Link href={"/add-user"}><button>Add User</button></Link>
      </div>
      <div>
        <table className="w-full border border-white">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Profile</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <Image
                    src={`/uploads/${user.profile}`}
                    alt="user-profile"
                    width={80}
                    height={80}
                    className="mx-auto"
                    priority
                  />
                </td>
                <td>{user.created_at}</td>
                <td>
                  <div className="flex gap-3 justify-center">
                    <Link href={`/edit-user/${user.id}`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => deleteUser(user.id)}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

