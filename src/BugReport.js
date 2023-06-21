const BugReport = ({ error }) => {
  return (
    <>
      <p className="errors">
        BlueScribe is having an issue validating {error.location}. This is a bug; please report it, along with a copy of
        your roster.{' '}
        <span role="link" onClick={() => console.log(error)}>
          Log error to console.
        </span>
      </p>
      <details>
        <summary>{error.message}</summary>
        <code>{error.stack}</code>
      </details>
    </>
  )
}
export default BugReport
