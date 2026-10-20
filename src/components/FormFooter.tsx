
import { Link } from 'react-router-dom'
const FormFooter = ({ linkTo, textFooter, textLink, className }) => {
    return (
        <div className={className}>
            <p>
                {textFooter} {' '}
                <Link to={linkTo} className='underline font-semibold cursor-pointer ms-1'>{textLink}</Link>
            </p>
        </div>
    )
}

export default FormFooter