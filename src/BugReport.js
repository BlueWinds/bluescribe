 import { Tooltip } from 'react-tooltip'

const BugReport = ({ error }) => {
  return <>
    BlueScribe is having an issue validating {error.location}. This is a bug; please report it, along with a copy of your roster. <span role="link" onClick={() => console.log(error)}>Log error to console.</span>
  </>
}
export default BugReport
