import { useRef, useEffect } from 'react'

const SelectionModal = ({ children, open, setOpen }) => {
  const ref = useRef()

  useEffect(() => {
    if (open) {
      document.lastChild.classList.add('modal-is-open')
    } else {
      document.lastChild.classList.remove('modal-is-open')
    }

    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      setOpen(false)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, setOpen, open])

  return (
    <dialog open={open}>
      <article ref={ref}>{children}</article>
    </dialog>
  )
}

export default SelectionModal
