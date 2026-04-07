import { useRef, useEffect, useState } from 'react'

const CollapsiblePanel = ({ open, children }) => {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(open ? ref.current.scrollHeight : 0)
    }
  }, [open, children])

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-out"
      style={{
        maxHeight: `${height}px`,
        opacity: open ? 1 : 0,
        marginBottom: open ? '1.5rem' : 0,
      }}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  )
}

export default CollapsiblePanel
