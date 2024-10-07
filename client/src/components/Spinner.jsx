import { FadeLoader } from 'react-spinners'

export default function Spinner() {
  const override = {
    display: 'flex',
    margin: 'auto',
    color: '#3a3632'
  }

  return <FadeLoader cssOverride={override} size={150} />
}
