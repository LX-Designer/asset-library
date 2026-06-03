import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '4')
const guidance = compareGuidance['4']

export default function Act4(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
