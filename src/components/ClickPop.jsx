import { useState, useCallback } from 'react';

export default function ClickPop({ children, className = '', scale = 0.95 }) {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = useCallback((e) => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 300);

    const onClick = children?.props?.onClick;
    if (onClick) {
      onClick(e);
    }
  }, [children]);

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{
        animation: isPopping ? 'popIn 0.3s ease-[cubic-bezier(0.32,0.72,0,1)]' : undefined,
      }}
    >
      {children}
    </div>
  );
}
