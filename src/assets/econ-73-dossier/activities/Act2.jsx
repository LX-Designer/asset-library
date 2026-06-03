import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '2')
const guidance = compareGuidance['2']

export default function Act2(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
