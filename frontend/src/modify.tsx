import React, { useEffect, useState } from 'react'
import MultiSelect from './multiselect'
import PocketBase from 'pocketbase'
import * as Types from './types'
import API from './api'
import './App.css'

const pb = new PocketBase('http://127.0.0.1:8090')

const PolicyForm = ({
  policyId,
  users,
  groups,
  apps,
}: {
  policyId?: string
  users: Types.User[]
  groups: Types.Group[]
  apps: Types.Apps[]
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [app, setApp] = useState('')
  const [visibility, setVisibility] = useState<string[]>([])
  const [accessLength, setAccessLength] = useState('')
  const [reviewers, setReviewers] = useState<string[]>([])
  const [provisioningSteps, setProvisioningSteps] = useState('')
  const [accessibility, setAccessibility] = useState<string[]>(['everyone'])
  useEffect(() => {
    if (!policyId) return

    const fetchPolicy = async () => {
      try {
        const response = await API.get(`/getOnePolicy/${policyId}`)
        const policy = response.data
        setName(policy.name)
        setDescription(policy.description)
        setApp(policy.app)
        setVisibility(policy.policyVisibility || [])
        setAccessLength(policy.accessLength || '')
        setReviewers(policy.reviewers || [])
        setProvisioningSteps(policy.provisioningSteps || '')
        setAccessibility(policy.accessibility || [])
      } catch (err) {
        console.error('Error fetching policy:', err)
      }
    }

    fetchPolicy()
  }, [policyId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formattedAccessLength =
      accessLength.split('-').reverse().join('-') + ' 00:00:00.000Z'

    const data = {
      name,
      description,
      app,
      policyVisibility: visibility,
      accessLength: formattedAccessLength,
      reviewers,
      provisioningSteps,
      accessibility,
    }

    try {
      if (policyId) {
        await API.post('/updatePolicy', { policyId, data })
        console.log('Policy updated')
      }
    } catch (err) {
      console.error('Error saving policy:', err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            Name:
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-group"
            />
          </div>
          <div className="form-group">
            Description:
            <input
              type="text"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-group"
            />
          </div>
          <div className="form-group">
            App:
            <select
              name="app"
              required
              value={app}
              onChange={(e) => setApp(e.target.value)}
              className="form-group"
            >
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
              value={accessLength}
              onChange={(e) => setAccessLength(e.target.value)}
              className="form-group"
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
            <input
              type="text"
              name="provisioningSteps"
              required
              value={provisioningSteps}
              onChange={(e) => setProvisioningSteps(e.target.value)}
              className="form-group"
            />
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
          <button type="submit" className="primary-btn">
            Update Policy
          </button>
        </div>
      </form>
    </div>
  )
}

export default PolicyForm
