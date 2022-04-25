import {useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import { Button } from '../components/Button'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss';
import { database } from '../services/firebase';
import DarkMode from '../components/DarkMode';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
const {user} = useAuth();
const params = useParams<RoomParams>();
const roomId = params.id
const history = useNavigate();

const {questions, title} = useRoom(roomId || '')

async function handleDeleteQuestion(questionId: string) {
   if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
   }
}

async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
    })

    history('/')
}

async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
    });
}

async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
    });
}

    return (
        <div id="page-room">
<header>
    <div className="content">
        <img src={logoImg} alt="letmeask"/>
        
        <div className="butao">
        <RoomCode code={params.id || ""}/> {/*arrumar bug | code={roomId} */}
        <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
        </div>

    </div>
</header>
<main>
    <div className="room-title">
       <h1>sala {title}</h1>
       {questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
    </div>
    <div className="question-list">
    {questions.map(question => {
        return (
            <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHightlighted}
            >
                <div className="button-gap">
            {!question.isAnswered && (
                <>
                    <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                        <img src={checkImg} alt="marcar pergunta como respondida" />
                    </button>
        
                    <button
                    type="button"
                    onClick={() =>  handleHighlightQuestion(question.id)}>
                        <img src={answerImg} alt="dar destaque a pergunta" />
                    </button>
                    </>
            )}
            <button
            type="button"
            onClick={() => handleDeleteQuestion(question.id)}>
                <img src={deleteImg} alt="remover pergunta" />
            </button>
            </div>
            </Question>
        )
    })}
    </div>
</main>
<div className='darkmodebutton'>
    <DarkMode/>
</div>
        </div>
    )
}