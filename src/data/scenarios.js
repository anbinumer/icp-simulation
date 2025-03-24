// src/data/scenarios.js
export const scenarios = [
  {
    id: "initial",
    title: "Initial Assessment",
    description: "Sarah Chen, 28, was found unconscious at her desk by cleaning staff. Her colleagues mention she's been complaining of severe headaches for the past week. Initial assessment reveals: GCS 13 (E3V4M6), BP 142/88, HR 72, and subtle right pupillary enlargement. A CT scan reveals cerebral edema in the right temporal lobe with early signs of midline shift.",
    question: "What is your first priority?",
    options: [
      { 
        text: "Administer mannitol immediately", 
        outcome: "Negative", 
        feedback: "Administering mannitol without proper assessment of ICP and without doctor's orders is premature. Sarah's condition deteriorates as the treatment was not appropriate for her current status." 
      },
      { 
        text: "Establish baseline neurological assessment", 
        outcome: "Positive", 
        feedback: "Good choice. You thoroughly document pupil size/reactivity, GCS components, and vital signs, establishing an important baseline for monitoring changes." 
      },
      { 
        text: "Call the neurosurgeon immediately", 
        outcome: "Neutral", 
        feedback: "The neurosurgeon appreciates being informed but suggests continuous monitoring and establishing a baseline assessment first before determining if surgical intervention is needed." 
      },
      { 
        text: "Position patient flat to increase cerebral perfusion", 
        outcome: "Negative", 
        feedback: "Positioning the patient flat may increase ICP. Sarah's ICP increases, and her condition worsens. Head elevation of 30° would have been more appropriate." 
      }
    ]
  },
  {
    id: "monitoring",
    title: "Changes in Status",
    description: "30 minutes later, you notice Sarah's right pupil is now 4mm and sluggish compared to her left at 2.5mm. Her BP is rising to 158/90, while her heart rate has dropped to 68. Her breathing pattern is becoming irregular.",
    question: "What is your next action?",
    options: [
      { 
        text: "Continue monitoring and reassess in 30 minutes", 
        outcome: "Negative", 
        feedback: "These are progressive signs of increasing ICP and potential early Cushing's response. Delaying intervention allows Sarah's condition to worsen significantly." 
      },
      { 
        text: "Notify the physician immediately of these changes", 
        outcome: "Positive", 
        feedback: "Correct. These changes suggest decompensation and early Cushing's triad. The physician orders immediate interventions including possible osmotic therapy and preparation for possible intubation." 
      },
      { 
        text: "Administer oxygen via nasal cannula", 
        outcome: "Neutral", 
        feedback: "While oxygenation is important, it doesn't address the underlying ICP issue. You've helped prevent hypoxia but still need to address the changing neurological status." 
      },
      { 
        text: "Lower the head of the bed to improve cerebral blood flow", 
        outcome: "Negative", 
        feedback: "Lowering the head of bed will increase ICP further. Sarah's condition deteriorates rapidly, and she shows signs of herniation." 
      }
    ]
  },
  {
    id: "intervention",
    title: "Emergency Management",
    description: "The physician has ordered hyperventilation, mannitol, and preparation for possible surgical intervention. Sarah's BP is now 165/92, HR 58, and her left arm no longer withdraws to painful stimuli, though her right side remains more responsive.",
    question: "How do you prioritize interventions?",
    options: [
      { 
        text: "Administer mannitol first, then prepare for hyperventilation", 
        outcome: "Positive", 
        feedback: "Good prioritization. Mannitol will help reduce ICP through osmotic action, while preparing for controlled hyperventilation addresses the critical situation. Sarah's condition stabilizes temporarily." 
      },
      { 
        text: "Focus on hyperventilation first to quickly reduce ICP", 
        outcome: "Neutral", 
        feedback: "While hyperventilation can quickly reduce ICP, prolonged hyperventilation without addressing the underlying issue can lead to cerebral ischemia. Sarah stabilizes initially but may face complications." 
      },
      { 
        text: "Call for immediate surgical intervention before other measures", 
        outcome: "Neutral", 
        feedback: "Surgical intervention may eventually be necessary, but trying medical management first is standard protocol. The neurosurgeon agrees to come but suggests continuing medical management meanwhile." 
      },
      { 
        text: "Repeat the CT scan before any interventions", 
        outcome: "Negative", 
        feedback: "Delaying interventions to repeat imaging when there are clear clinical signs of deterioration wastes valuable time. Sarah's condition worsens significantly during transport to CT." 
      }
    ]
  },
  {
    id: "critical",
    title: "Critical Decompensation",
    description: "Despite initial interventions, Sarah's condition is worsening. Her right pupil is now 5mm and minimally reactive, BP 178/95, HR 52 with irregular breathing patterns. The neurosurgeon is 20 minutes away.",
    question: "What is the most appropriate nursing action now?",
    options: [
      { 
        text: "Prepare for intubation and hyperventilation", 
        outcome: "Positive", 
        feedback: "Excellent decision. Securing the airway and providing controlled ventilation is crucial at this stage. This helps stabilize Sarah until the neurosurgeon arrives." 
      },
      { 
        text: "Increase mannitol dosage without physician order", 
        outcome: "Negative", 
        feedback: "Increasing medication dosage without orders is outside nursing scope and could cause dangerous fluid/electrolyte imbalances. Sarah develops complications from inappropriate dosing." 
      },
      { 
        text: "Prepare operating room for immediate decompressive craniectomy", 
        outcome: "Neutral", 
        feedback: "While surgical intervention will likely be needed, preparing the OR is appropriate but shouldn't delay immediate interventions like airway management. The OR team appreciates the heads-up but reminds you to focus on immediate stabilization." 
      },
      { 
        text: "Administer sedatives to reduce agitation", 
        outcome: "Negative", 
        feedback: "Sedatives may mask neurological symptoms and could further depress respiratory drive. Without securing the airway first, this intervention leads to respiratory depression and worsening hypercapnia." 
      }
    ]
  },
  {
    id: "resolution",
    title: "Preparation for Surgery",
    description: "The neurosurgeon has arrived and Sarah has been intubated. Her ICP monitoring device shows pressures of 28 mmHg despite ongoing medical management. The decision has been made for decompressive surgery.",
    question: "What is your priority in preparing for transfer to the OR?",
    options: [
      { 
        text: "Ensure all documentation is complete before transfer", 
        outcome: "Negative", 
        feedback: "While documentation is important, it should not delay emergency transfer. Sarah's condition deteriorates further during the delay." 
      },
      { 
        text: "Disconnect the ICP monitoring device for transport", 
        outcome: "Negative", 
        feedback: "ICP monitoring should continue during transport in this critical situation. Without monitoring, subtle changes indicating herniation are missed." 
      },
      { 
        text: "Prepare family for possible poor outcome", 
        outcome: "Neutral", 
        feedback: "While family communication is important, this should be handled by the physician after ensuring the patient is stabilized and en route to definitive care. Your focus should remain on the patient's immediate needs." 
      },
      { 
        text: "Maintain head elevation, continue ICP management during transport", 
        outcome: "Positive", 
        feedback: "Excellent. Maintaining proper positioning and continuing all ICP management during transport is crucial. Your attention to these details ensures Sarah arrives at the OR in the best possible condition." 
      }
    ]
  }
];