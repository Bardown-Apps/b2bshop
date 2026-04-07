import { useEffect, useRef, useState } from 'react'

const FieldError = ({ message }) => {
  const [display, setDisplay] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (message) {
      setDisplay(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const timer = setTimeout(() => setDisplay(false), 200)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!display) return null

  return (
    <p
      ref={ref}
      className="text-xs text-red-500 overflow-hidden transition-all duration-200 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        maxHeight: visible ? '2rem' : '0px',
        marginTop: visible ? '4px' : '0px',
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
      }}
    >
      {message}
    </p>
  )
}

export default FieldError
