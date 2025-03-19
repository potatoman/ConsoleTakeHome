//time so far: 2hrs, most of it spent on pocketbase >:( they made auth checks so gay
//time so far: ~3hrs successfully created policy and stored it in pocketbase
//time so far: ~4hrs successfully created modify policy and update policy
//time so far: ~5hrs css is so gay
//time so far: ~6hrs my hatred towards css is incredible, i spent half an hour trying to do resize but i gave up
//ill start leaving comments and stuff now and final css touches

import { useEffect, useState } from 'react'
import API from './api'
import Table from './table'
import { Apps, User, Group, Policy } from './types'
import MultiSelect from './multiselect'
import PolicyForm from './modify'
import './App.css'


function App() {
  //would probly put some of these into context to avoid prop drilling like apps, groups users etc. but its small so np
  const [createMessage, setCreateMessage] = useState('')
  const [removeMessage, setRemoveMessage] = useState('')
  const [policies, setPolicies] = useState([])
  const [apps, setApps] = useState<Apps[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [visibility, setVisibility] = useState<string[]>(['everyone'])
  const [accessLength, setAccessLength] = useState<string>('')
  const [reviewers, setReviewers] = useState<string[]>(['app owner'])
  const [policyId, setPolicyId] = useState<string>('')
  const [accessibility, setAccessibility] = useState<string[]>(['everyone'])

  useEffect(() => {
    API.get('/getApps').then((res) => setApps(res.data))
    API.get('/getGroups').then((res) => setGroups(res.data))
    API.get('/getUsers').then((res) => setUsers(res.data))
    API.get('/getPolicies').then((res) => setPolicies(res.data))
  }, [])

  const handleAccessLength = (accessLength: string) => {
    //did it this way to match pocketbase format cus theyre gay (consistency tbh)
    const [day, month, year] = accessLength.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.toISOString().replace('T', ' ').replace('Z', 'Z')
  }

  const handlePost = (policy: Policy, e: React.FormEvent<HTMLFormElement>) => {
    API.post('/createPolicy', policy)
    .then((res) => {
      setCreateMessage('Policy created successfully')
      setVisibility(['everyone'])
      setAccessibility(['everyone'])
      setAccessLength('')
      setReviewers(['app owner'])
      ;(e.target as HTMLFormElement).reset()
    })
    .catch((err) =>
      setCreateMessage('Error creating policy: ' + err.message)
    )
  }

  return (
    //wrapper is the main container, sidebar is the left side bar, container is the right side content
    <div className="wrapper">
      {/* sidebar */}
      <div className="sidebar">
        <details>
          <summary>Apps</summary>
          <Table title="Apps" data={apps} />
        </details>
        <details>
          <summary>Groups</summary>
          <Table title="Groups" data={groups} />
        </details>
        <details>
          <summary>Users</summary>
          <Table title="Users" data={users} />
        </details>
        <details>
          <summary>Policies</summary>
          <Table title="Policies" data={policies} />
          {/* definitely a better way to update than to have a button, but unsure how fast pocketbase is with their updates so i wanted to keep it simple
          instead of calling update again whenever a new policy is created, removed, or modified, could have modified the policies state directly but that
          just makes it messier and unnecessary */}
          <button
            className="primary-btn"
            onClick={() =>
              API.get('/getPolicies').then((res) => setPolicies(res.data))
            }
          >
            Update Policies
          </button>
        </details>
      </div>

      {/* main content, the right side */}
      {/* create policy */}
      {/* definetly should have put the create policy in a separate component but i started out with the form in the app.tsx and now looking at it
      the amount of props i would have to pass in would be disgusting, miscalculation on my part */}
      <div className="container">
        <details className="card">
          <summary>Create Policy</summary>
          <form
            onSubmit={(e) => {
              //i do all this inside of the form element since its easy to get the form data without making
              //a million new states
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const policy = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                visibility: visibility,
                app: formData.get('app') as string,
                accessLength: handleAccessLength(accessLength),
                reviewers: reviewers,
                provisioningSteps: formData.get('provisioningSteps') as string,
                accessibility: accessibility,
              }
              handlePost(policy, e)
            }}
          >
            <div className="form-container">
            <div className="form-group">
              Name:
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              Description:
              <input type="text" name="description" required />
            </div>
            <div className="form-group">
              App:
              <select name="app" required>
                {apps.map((app, index) => (
                  <option key={index} value={app.name}>
                    {app.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              Policy Visibility:
              <MultiSelect
                users={users}
                groups={groups}
                selectedValues={visibility}
                setSelectedValues={setVisibility}
              />
            </div>
            <div className="form-group">
              Access Length (DD-MM-YYYY):
              <input
                type="text"
                name="accessLength"
                required
                placeholder="DD-MM-YYYY"
                onChange={(e) => {
                  setAccessLength(e.target.value)
                }}
                value={accessLength}
              />
            </div>
            <div className="form-group">
              Reviewers:
              <MultiSelect
                users={users}
                groups={groups}
                selectedValues={reviewers}
                setSelectedValues={setReviewers}
              />
            </div>
            <div className="form-group">
              Provisioning Steps:
              <input type="text" name="provisioningSteps" required />
            </div>
            <div className="form-group">
              Accessibility:
              <MultiSelect
                users={users}
                groups={groups}
                selectedValues={accessibility}
                setSelectedValues={setAccessibility}
              />
            </div>
            <button type="submit" className="primary-btn">Create Policy</button>
            </div>
          </form>
          <p>{createMessage}</p>
        </details>


        {/* remove policy */}
        <details className="card">
          <summary>Remove Policy</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const policyId = formData.get('policyId')
              API.post('/removePolicy', { policyId })
                .then((res) => {
                  setRemoveMessage('Policy removed successfully')
                  API.get('/getPolicies').then((res) => setPolicies(res.data))
                })
                .catch((err) =>
                  setRemoveMessage('Error removing policy: ' + err.message)
                )
            }}
          >
            <div className="form-group">
              Policy ID:
              <input type="text" name="policyId" required />
              <button type="submit" className="danger-btn">Remove Policy</button>
            </div>
          </form>
          <p>{removeMessage}</p>
        </details>

        {/* modify policy */}
        <details className="card">
          <summary>Modify Policy</summary>
          <div>
            <input
              type="text"
              placeholder="Enter Policy ID"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
            />
            <button onClick={() => setPolicyId(policyId)} className="primary-btn">Load Policy</button>
          </div>
          <div className="form-group">
          {/* have to wait until the policy id was inputted to load the policy form */}
          {policyId && (
            <PolicyForm
              policyId={policyId}
              users={users}
              groups={groups}
              apps={apps}
            />
          )}
          </div>
        </details>
      </div>
    </div>
  )
}

export default App
