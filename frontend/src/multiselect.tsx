import { User, Group } from './types'
import './multiselect.css'

const MultiSelect = ({
  users,
  groups,
  selectedValues,
  setSelectedValues,
}: {
  users: User[]
  groups: Group[]
  selectedValues: string[]
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (opt) => opt.value
    )
    setSelectedValues((prevValues) => {
      const newValues = [...prevValues]
      selectedOptions.forEach((option) => {
        const index = newValues.indexOf(option)
        if (index === -1) {
          newValues.push(option)
        } else {
          newValues.splice(index, 1)
        }
      })
      return newValues
    })
  }

  return (
    <div className="multi-select-container">
      <select
        className="multi-select"
        name="visibility"
        id="visibility"
        multiple
        value={selectedValues}
        onChange={handleChange}
      >
        {selectedValues[0] === 'everyone' ? <option value="everyone">Everyone</option> : <option value="app owner">App Owner</option>}
        {users.map((user) => (
          <option key={user.id} value={`user:${user.id}`}>
            User: {user.firstName} {user.lastName}
          </option>
        ))}
        {groups.map((group) => (
          <option key={group.id} value={`group:${group.id}`}>
            Group: {group.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MultiSelect
