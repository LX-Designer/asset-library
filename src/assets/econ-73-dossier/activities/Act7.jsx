import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '7')
const guidance = compareGuidance['7']

export default function Act7(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
