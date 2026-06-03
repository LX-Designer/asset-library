import ActivityForm from './ActivityForm.jsx'
import { activities, compareGuidance } from '../data.js'

const activity = activities.find(a => a.id === '6')
const guidance = compareGuidance['6']

export default function Act6(props) {
  return <ActivityForm activity={activity} guidance={guidance} {...props} />
}
