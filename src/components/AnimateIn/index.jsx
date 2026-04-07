import useInView from '@/hooks/useInView'

const ANIMATIONS = {
  fadeUp: 'animate-fade-up',
  fadeIn: 'animate-fade-in',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  popIn: 'animate-pop-in',
}

const AnimateIn = ({
  as: Tag = 'div',
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.1,
  className = '',
  children,
  ...rest
}) => {
  const [ref, inView] = useInView({ threshold })

  return (
    <Tag
      ref={ref}
      className={`${inView ? ANIMATIONS[animation] : 'opacity-0'} ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default AnimateIn
