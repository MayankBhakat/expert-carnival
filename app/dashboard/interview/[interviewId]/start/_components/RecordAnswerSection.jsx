

import 'regenerator-runtime/runtime';  // Add this line
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    
  
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const { transcript, resetTranscript,browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [recording,setRecording] = useState(false);

  if (!browserSupportsSpeechRecognition) {
      return null
  }
  
    const [userAnswer,setUserAnswer]=useState('');
    const {user}=useUser();
    const [loading,setLoading]=useState(false);


      const StartStopRecording=async()=>{
        if(recording)
        {
          SpeechRecognition.stopListening();
          setRecording(false);
          
          if (transcript.length > 10) {
            setUserAnswer(transcript);
            UpdateUserAnswer(transcript);
          }
        }
        else{
          startListening();
          setRecording(true);
        }
      }

      const UpdateUserAnswer=async(userAnswer)=>{

        setLoading(true)
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
        ", User Answer:"+userAnswer+",Depends on question and user answer for give interview question "+
        " please give us rating out of 10 for answer and feedback as area of improvmenet if any "+
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
        
        const result=await chatSession.sendMessage(feedbackPrompt);
        
        const mockJsonResp=(await result.response.text()).replace('```json','').replace('```','');
        
        const JsonFeedbackResp=JSON.parse(mockJsonResp);
        const resp=await db.insert(UserAnswer)
        .values({
          mockIdRef:interviewData?.mockId,
          question:mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns:userAnswer,
          feedback:JsonFeedbackResp?.feedback,
          rating:JsonFeedbackResp?.rating,
          userEmail:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-yyyy')
        })

        if(resp)
        {
          toast('User Answer recorded successfully');
          setUserAnswer('');
          resetTranscript();
        }
        resetTranscript();
        setLoading(false);
      }


  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
            <Image src={'/webcam.png'} width={200} height={200} 
            className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:500,
                width:500,
                zIndex:10,
            }}
            />
        </div>
        <Button 
        disabled={loading}
        variant="outline" className="my-10"
     
        onClick={StartStopRecording}
        >

            {recording ?
            <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                <StopCircle/>Stop Recording
            </h2>
            :
            
            <h2 className='text-primary flex gap-2 items-center'>
              <Mic/>  Record Answer</h2> }</Button>
      
     
    </div>
  )
}

export default RecordAnswerSection
