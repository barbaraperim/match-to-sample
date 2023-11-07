import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';
import { PhaseType } from './model/phase-type.enum';
import { Phase } from './model/phase.model';
import { Routine } from './model/routine';
import { Stimuli } from './model/stimuli.model';
import { ImageConfig } from '@angular/common';
import { Step } from './model/step.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;

  minNumOfClasses = 1;
  minNumOfCategories = 2;

  numOfClasses = 3;
  numOfCategories = 4;

  useDefault = true;

  routine: Routine = [];
  stimuli: Stimuli = [];

  sampleImage!: string;
  optionImages!: Array<string>;


  currentPhase!: Phase;
  currentSteps!: Step[];

  currentPhaseIndex = 0;
  currentStepIndex = 0;

  error = true;


  constructor(public dialog: MatDialog) {}  

  ngOnInit(): void {   
   this.initiateGame();       
  }

  initiateGame(): void {
    this.routine = this.getRoutineOne();
    this.stimuli = this.getStimuli();
    
    this.nextPhase();
   // while(this.nextPhase && (currentPhaseIndex < this.routine.length)) {
      
  //  }
  }

  nextPhase(): void {
    this.currentPhase = this.routine[this.currentPhaseIndex];
    this.currentSteps = this.getSteps(this.currentPhase);
    this.nextStep();
  }

  nextStep(): void {
    console.log('currentPhase: ' + this.currentPhaseIndex + ' currentStep: ' + this.currentStepIndex);
    
    let step = this.currentSteps[this.currentStepIndex];
    
    console.log('step.sampleClass  ' + step.sampleClass);
    
    this.sampleImage = this.stimuli[step.sampleClass][step.sampleCategory];
    
    let optionImages = [];
    for (let i = 0; i < this.numOfClasses; i++) {
      let optionPosition = (step.optionsStartPosition+i)%this.numOfClasses;
      optionImages.push(this.stimuli[optionPosition][step.optionsCategory]);
    }

    this.optionImages = optionImages;
  }

  updateCurrentPhaseIndex(): void {
    if (this.currentPhaseIndex < this.routine.length){
      this.currentPhaseIndex++;
      this.nextPhase();
    } else {
      console.log('FIM DA LINHA')

    }
  }

  updateCurrentStepIndex(): void {
    if (this.currentStepIndex < this.currentSteps.length-1){
      this.currentStepIndex++;
      this.nextStep();
    } else {
      this.currentStepIndex = 0;
      this.updateCurrentPhaseIndex();
      console.log('FIM DA LINHA')
    }
  }

  onClickImage(imageClicked: number): void {    
    
    if (this.currentPhase.type === PhaseType.PRACTICE) {
      console.log('imageClicked ' + imageClicked);
      console.log('optionsStartPosition '+ this.currentSteps[this.currentStepIndex].optionsStartPosition);
      
      
      if (imageClicked === this.currentSteps[this.currentStepIndex].optionsCorrectPosition) {
        this.error = false;
      } else {
        this.error = true;
      }
      this.feedbackModal.toggle();
    }
    this.updateCurrentStepIndex();

  }

  acaoPrimaria(): void {
    console.log('acao primaria')
  }





  getLinearRoutine(): Routine { return [] }
  getDefaultRoutine(): Routine { return [] } 

  getSteps(phase: Phase): Step[] {
    let steps: Step[] = [];

    for(let i = 0; i < this.numOfClasses; i++) {
      for (let z = 0; z < this.numOfClasses; z++) {
        let sampleClass = (i+z)%this.numOfClasses;
        steps.push({
          sampleCategory: phase.sampleCategory,
          sampleClass: sampleClass,
          optionsCategory: phase.optionsCategory,
          // REVISAR LINHA ABAIXO
          optionsStartPosition: i,
          optionsCorrectPosition: z
        });

        console.log('correctPosition  ', (i+sampleClass)%this.numOfClasses);
      }
    }    

    return steps;
  }

  private getRoutineOne(): Routine {
    return [
      {
        type: PhaseType.PRACTICE,
        sampleCategory: 0,
        optionsCategory: 1
      },
      {
        type: PhaseType.PRACTICE,
        sampleCategory: 1,
        optionsCategory: 2
      },
      {
        type: PhaseType.PRACTICE,
        sampleCategory: 3,
        optionsCategory: 0
      },
      {
        type: PhaseType.TEST,
        sampleCategory: 3,
        optionsCategory: 4
      },
      {
        type: PhaseType.TEST,
        sampleCategory: 4,
        optionsCategory: 3
      },
    ]
  }

  private getStimuli(): Stimuli{
    const stimuli =  [
      ['rosa', 'cruz', 'jus', 'casa'],
      ['amarelo', 'triangulo', 'os', 'bola'],
      ['azul', 'quadrilatero', 'aba', 'gato']
    ]

    this.numOfClasses = stimuli.length;
    this.numOfCategories = stimuli[0].length;

    return stimuli;
  }
}
