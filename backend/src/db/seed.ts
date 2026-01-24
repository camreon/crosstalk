import { db, initDatabase } from './database.js';

interface TopicData {
  name: string;
  description: string;
  questions: {
    text: string;
    type: 'likert' | 'multiple_choice' | 'yes_no';
    options?: string[];
  }[];
}

const topics: TopicData[] = [
  {
    name: 'Gun Control',
    description: 'Questions about firearm regulations, ownership, and safety',
    questions: [
      {
        text: 'Background checks should be required for all gun purchases, including private sales',
        type: 'likert',
      },
      {
        text: 'There should be a mandatory waiting period between purchasing and receiving a firearm',
        type: 'likert',
      },
      {
        text: 'Gun safety training should be required before purchasing a firearm',
        type: 'likert',
      },
      {
        text: 'There should be restrictions on high-capacity magazines',
        type: 'likert',
      },
      {
        text: 'Red flag laws (allowing temporary removal of guns from people deemed dangerous) are appropriate',
        type: 'likert',
      },
      {
        text: 'The minimum age to purchase a firearm should be:',
        type: 'multiple_choice',
        options: ['18', '21', '25', 'No minimum with parental consent', 'No restrictions'],
      },
      {
        text: 'Schools should have armed security guards',
        type: 'yes_no',
      },
      {
        text: 'Mental health records should be included in background check databases',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Healthcare',
    description: 'Questions about healthcare access, insurance, and policy',
    questions: [
      {
        text: 'Healthcare is a fundamental right that should be guaranteed to all citizens',
        type: 'likert',
      },
      {
        text: 'The government should provide a public health insurance option',
        type: 'likert',
      },
      {
        text: 'Private health insurance should continue to be available alongside any public option',
        type: 'likert',
      },
      {
        text: 'Prescription drug prices should be regulated by the government',
        type: 'likert',
      },
      {
        text: 'What healthcare system do you prefer?',
        type: 'multiple_choice',
        options: [
          'Fully private market-based system',
          'Private with government subsidies for low-income',
          'Public option alongside private insurance',
          'Medicare for All (single-payer)',
        ],
      },
      {
        text: 'Employers should be required to provide health insurance to full-time employees',
        type: 'likert',
      },
      {
        text: 'States should be able to set their own healthcare policies independent of federal guidelines',
        type: 'likert',
      },
      {
        text: 'Preventive care should be fully covered without cost-sharing',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Immigration',
    description: 'Questions about immigration policy, border security, and citizenship',
    questions: [
      {
        text: 'The United States should increase legal immigration levels',
        type: 'likert',
      },
      {
        text: 'There should be a path to citizenship for undocumented immigrants who have lived in the US for many years',
        type: 'likert',
      },
      {
        text: 'Border security should be strengthened with physical barriers',
        type: 'likert',
      },
      {
        text: 'Employers should face penalties for hiring undocumented workers',
        type: 'likert',
      },
      {
        text: 'DACA recipients (brought to US as children) should be able to become citizens',
        type: 'likert',
      },
      {
        text: 'What should be the priority for immigration policy?',
        type: 'multiple_choice',
        options: [
          'Family reunification',
          'Skills-based immigration',
          'Refugee and humanitarian admissions',
          'Equal balance of all categories',
        ],
      },
      {
        text: 'Local law enforcement should cooperate with federal immigration authorities',
        type: 'yes_no',
      },
      {
        text: 'The asylum process should be made faster and more accessible',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Climate & Environment',
    description: 'Questions about climate change, energy policy, and environmental protection',
    questions: [
      {
        text: 'Climate change is primarily caused by human activities',
        type: 'likert',
      },
      {
        text: 'The government should subsidize renewable energy development',
        type: 'likert',
      },
      {
        text: 'There should be a carbon tax on fossil fuel emissions',
        type: 'likert',
      },
      {
        text: 'Nuclear power should be part of the solution to reduce carbon emissions',
        type: 'likert',
      },
      {
        text: 'Environmental regulations are necessary even if they increase costs for businesses',
        type: 'likert',
      },
      {
        text: 'What should be the timeline for transitioning to clean energy?',
        type: 'multiple_choice',
        options: [
          'As soon as possible, regardless of cost',
          'Within 15-20 years with a managed transition',
          'Gradual transition over 30+ years',
          'No mandated timeline - let the market decide',
        ],
      },
      {
        text: 'Electric vehicle adoption should be encouraged through tax incentives',
        type: 'likert',
      },
      {
        text: 'The US should remain in international climate agreements',
        type: 'yes_no',
      },
    ],
  },
  {
    name: 'Economy & Taxes',
    description: 'Questions about economic policy, taxation, and government spending',
    questions: [
      {
        text: 'Wealthy individuals should pay a higher percentage of their income in taxes',
        type: 'likert',
      },
      {
        text: 'Corporations should pay higher taxes',
        type: 'likert',
      },
      {
        text: 'The federal minimum wage should be increased',
        type: 'likert',
      },
      {
        text: 'What should the federal minimum wage be?',
        type: 'multiple_choice',
        options: [
          'No federal minimum - let states decide',
          '$10-12 per hour',
          '$15 per hour',
          '$20+ per hour',
        ],
      },
      {
        text: 'Government spending should be reduced to lower the national debt',
        type: 'likert',
      },
      {
        text: 'Free trade agreements benefit the American economy',
        type: 'likert',
      },
      {
        text: 'Labor unions are beneficial for workers',
        type: 'likert',
      },
      {
        text: 'The government should break up large tech monopolies',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Education',
    description: 'Questions about education policy, funding, and school choice',
    questions: [
      {
        text: 'Public schools should receive more funding',
        type: 'likert',
      },
      {
        text: 'Parents should have the option to use public funds for private school tuition',
        type: 'likert',
      },
      {
        text: 'College tuition at public universities should be free',
        type: 'likert',
      },
      {
        text: 'Student loan debt should be forgiven',
        type: 'likert',
      },
      {
        text: 'Teachers should be paid more',
        type: 'likert',
      },
      {
        text: 'What should be the primary focus of K-12 education reform?',
        type: 'multiple_choice',
        options: [
          'Increasing teacher pay and training',
          'Expanding school choice options',
          'Reducing class sizes',
          'Updating curriculum and standards',
          'Increasing technology in classrooms',
        ],
      },
      {
        text: 'Standardized testing is an effective measure of student achievement',
        type: 'likert',
      },
      {
        text: 'Trade and vocational programs should receive more emphasis alongside college prep',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Criminal Justice',
    description: 'Questions about policing, incarceration, and criminal justice reform',
    questions: [
      {
        text: 'Police departments need more funding for training and resources',
        type: 'likert',
      },
      {
        text: 'There should be more civilian oversight of police departments',
        type: 'likert',
      },
      {
        text: 'Mandatory minimum sentences should be eliminated',
        type: 'likert',
      },
      {
        text: 'Private prisons should be banned',
        type: 'likert',
      },
      {
        text: 'Cash bail should be eliminated',
        type: 'likert',
      },
      {
        text: 'Marijuana should be legalized federally',
        type: 'likert',
      },
      {
        text: 'What should be the primary goal of the criminal justice system?',
        type: 'multiple_choice',
        options: [
          'Punishment and deterrence',
          'Rehabilitation and reintegration',
          'Victim restitution',
          'Equal balance of all goals',
        ],
      },
      {
        text: 'People with nonviolent drug offenses should have their records expunged',
        type: 'likert',
      },
    ],
  },
  {
    name: 'Social Issues',
    description: 'Questions about social policies and civil rights',
    questions: [
      {
        text: 'Same-sex marriage should remain legal nationwide',
        type: 'likert',
      },
      {
        text: 'Discrimination based on sexual orientation or gender identity should be illegal',
        type: 'likert',
      },
      {
        text: 'Affirmative action policies in college admissions are appropriate',
        type: 'likert',
      },
      {
        text: 'The government should provide paid family leave',
        type: 'likert',
      },
      {
        text: 'There is systemic racism in American institutions',
        type: 'likert',
      },
      {
        text: 'Religious organizations should be exempt from anti-discrimination laws',
        type: 'likert',
      },
      {
        text: 'Social media companies should be able to moderate content as they see fit',
        type: 'yes_no',
      },
      {
        text: 'Free speech protections should apply to all speech except direct threats',
        type: 'likert',
      },
    ],
  },
];

async function seed() {
  console.log('Initializing database...');
  initDatabase();

  console.log('Clearing existing data...');
  db.exec('DELETE FROM responses');
  db.exec('DELETE FROM questions');
  db.exec('DELETE FROM topics');

  console.log('Seeding topics and questions...');

  const insertTopic = db.prepare(
    'INSERT INTO topics (name, description, sort_order) VALUES (?, ?, ?)'
  );

  const insertQuestion = db.prepare(
    'INSERT INTO questions (topic_id, text, question_type, options, sort_order) VALUES (?, ?, ?, ?, ?)'
  );

  topics.forEach((topic, topicIndex) => {
    const topicResult = insertTopic.run(topic.name, topic.description, topicIndex);
    const topicId = topicResult.lastInsertRowid;

    topic.questions.forEach((question, questionIndex) => {
      insertQuestion.run(
        topicId,
        question.text,
        question.type,
        question.options ? JSON.stringify(question.options) : null,
        questionIndex
      );
    });

    console.log(`  Created topic: ${topic.name} with ${topic.questions.length} questions`);
  });

  console.log('\nSeed completed successfully!');
  console.log(`Created ${topics.length} topics with ${topics.reduce((sum, t) => sum + t.questions.length, 0)} total questions`);
}

seed().catch(console.error);
