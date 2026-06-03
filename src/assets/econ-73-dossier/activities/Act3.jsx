import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '3')
const guidance = compareGuidance['3']

export default function Act3(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
