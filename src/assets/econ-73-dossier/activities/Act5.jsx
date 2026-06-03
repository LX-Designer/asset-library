import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '5')
const guidance = compareGuidance['5']

export default function Act5(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
