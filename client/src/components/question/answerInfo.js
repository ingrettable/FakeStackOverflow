import formatElapsedTime from '../lib/time';

export default function AnswerInfo({
    answers,
    fetchUserByID
}) {
    const showUsername = (ansby) => {
      const id = fetchUserByID(ansby)
      const username = id === undefined ? "Anonymous" : id.username;
      return username
    }
    return (
        <div>
            {
                answers.map((answer, index) => (
                    <div key={index}>
                        <div className="answerInfo" >
                            <p>{answer.text}</p>
                            <p>
                              <span className="usernameAnswer">{showUsername(answer.ans_by)}
                              </span> answered on {formatElapsedTime(answer.ans_date_time)}</p>
                        </div>
                    </div>
                ))
            }
            
        </div >
    );
}