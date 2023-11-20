import formatElapsedTime from '../lib/time';

export default function AnswerInfo({ answers }) {
    return (
        <div>
            {
                answers.map((answer, index) => (
                    <div key={index}>
                        <div className="answerInfo" >
                            <p>{answer.text}</p>
                            <p>
                                <span className="usernameAnswer">{answer.ans_by}
                                </span> answered on {formatElapsedTime(answer.ans_date_time)}</p>
                        </div>
                    </div>
                ))
            }
            
        </div >
    );
}