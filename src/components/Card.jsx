// Card — surface container with hairline border.
export function Card({ children, padding = 16, style = {}, ...rest }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--hairline)',
      borderRadius: 20,
      padding,
      ...style,
    }} {...rest}>{children}</div>
  );
}
