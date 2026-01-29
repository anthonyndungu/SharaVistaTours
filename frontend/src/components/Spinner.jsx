import { ClipLoader } from 'react-spinners'

export default function Spinner({ size = 'md' }) {
  const sizeMap = {
    sm: 20,
    md: 40,
    lg: 60
  }
  
  return (
    <div className="flex justify-center items-center">
      <ClipLoader
        size={sizeMap[size]}
        color="#2563eb"
        loading={true}
      />
    </div>
  )
}