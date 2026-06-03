import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '1')
const guidance = compareGuidance['1']

export default function Act1(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
