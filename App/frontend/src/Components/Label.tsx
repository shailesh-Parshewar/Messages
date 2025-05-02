
const Label = ({title, ref} : {title : string, ref : string}) => {
  return (
    <label  htmlFor={ref} className="label mt-4">
    <span className="label-text font-medium">{title}</span>
  </label>
  )
}

export default Label;