

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Check, X, Sparkles, RefreshCw, Video } from "lucide-react"; // Ajout de l'icône Video
import { memoData, flashcardsData, quizQuestionsData, termsToDefineAutomatically } from './constants';
import { fetchGlossaryDefinitions, explainMedicalTermWithGemini } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('memo');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [medicalTerm, setMedicalTerm] = useState<string>('');
  const [medicalExplanation, setMedicalExplanation] = useState<string>('');
  const [isExplainingTerm, setIsExplainingTerm] = useState(false);

  const [glossaryTerms, setGlossaryTerms] = useState<{ [key: string]: string }>({});
  const [isLoadingGlossaryTerms, setIsLoadingGlossaryTerms] = useState(false);

  const toggleSection = (index: number): void => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCard((prev) => (prev + 1) % flashcardsData.length), 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCard((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length), 200);
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    if (optionIndex === quizQuestionsData[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
  };

  const loadInitialGlossaryTerms = useCallback(async () => {
    if (Object.keys(glossaryTerms).length > 0 || isLoadingGlossaryTerms) {
      return;
    }
    setIsLoadingGlossaryTerms(true);
    try {
      const fetchedTerms = await fetchGlossaryDefinitions(termsToDefineAutomatically);
      setGlossaryTerms(fetchedTerms);
    } catch (error) {
      console.error("Erreur lors de la récupération des termes initiaux du glossaire dans le composant:", error);
    } finally {
      setIsLoadingGlossaryTerms(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glossaryTerms, isLoadingGlossaryTerms]); 

  useEffect(() => {
    if (!showWelcomeScreen) {
        loadInitialGlossaryTerms();
    }
  }, [showWelcomeScreen, loadInitialGlossaryTerms]);

  const highlightTextWithGlossary = useCallback((text: string): React.ReactNode => {
    if (!glossaryTerms || Object.keys(glossaryTerms).length === 0 || !text) {
      return text;
    }

    let result: (string | React.ReactElement)[] = [text];
    let keyCounter = 0;

    Object.keys(glossaryTerms).forEach(termKey => {
      const definition = glossaryTerms[termKey];
      const escapedTermKey = termKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedTermKey})\\b`, 'gi');

      let nextResult: (string | React.ReactElement)[] = [];
      result.forEach(segment => {
        if (typeof segment === 'string') {
          const parts = segment.split(regex);
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i % 2 === 1) { // Matched term
              nextResult.push(
                <span
                  key={`highlight-${termKey}-${keyCounter++}`}
                  className="relative group cursor-help font-semibold text-blue-600 hover:text-blue-800 border-b border-dotted border-blue-400"
                  title={definition} // Tooltip with definition
                >
                  {part}
                </span>
              );
            } else { // Non-matching text part
              if (part !== '') {
                nextResult.push(part);
              }
            }
          }
        } else { // Already a React element (e.g., previously highlighted segment)
          nextResult.push(segment);
        }
      });
      result = nextResult;
    });
    return result;
  }, [glossaryTerms]);


  const handleExplainMedicalTerm = async () => {
    if (!medicalTerm.trim()) {
      setMedicalExplanation("Veuillez entrer un terme médical à expliquer.");
      return;
    }
    setIsExplainingTerm(true);
    setMedicalExplanation('');

    const lowerCaseTerm = medicalTerm.toLowerCase();
    if (glossaryTerms[lowerCaseTerm]) {
      setMedicalExplanation(glossaryTerms[lowerCaseTerm]);
      setIsExplainingTerm(false);
      return;
    }

    try {
      const explanation = await explainMedicalTermWithGemini(medicalTerm);
      setMedicalExplanation(explanation);
      // Add to glossary if successful and not an error message
      if (!explanation.startsWith("Erreur :")) {
        setGlossaryTerms(prev => ({ ...prev, [lowerCaseTerm]: explanation }));
      }
    } catch (error) {
      console.error("Erreur lors de l'explication du terme médical dans le composant:", error);
      setMedicalExplanation("Erreur : Problème de connexion ou service indisponible.");
    } finally {
      setIsExplainingTerm(false);
    }
  }
  
  const WelcomeScreen = () => (
     <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <img
            src="https://pharmaconseilbmb.com/podcast/femme/candidose-vaginale.jpg"
            alt="Illustration candidose vaginale"
            className="w-full max-w-md h-auto rounded-lg shadow-2xl mb-8 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale'; }}
        />
        <button
            onClick={() => setShowWelcomeScreen(false)}
            className="px-10 py-4 bg-slate-800 text-white text-xl font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
        >
            Commencer la formation
        </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 max-w-4xl mx-auto font-inter text-slate-900 rounded-lg shadow-xl">
      <header className="mb-8 border-b border-slate-200 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-700">Mémo fiche conseil</h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-1">Candidose Vaginale</h2>
      </header>

      {showWelcomeScreen ? <WelcomeScreen /> : (
        <>
          <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-md z-10 py-4 px-2 rounded-lg shadow-sm">
            <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['memo', 'flashcards', 'quiz', 'kahoot', 'video', 'glossary', 'podcast'].map((tab) => ( // Ajout de 'video'
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-200 ease-in-out font-medium whitespace-nowrap
                    ${activeTab === tab 
                      ? 'bg-slate-800 text-white shadow-md scale-105' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 hover:shadow-sm'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'memo' && (
            <section className="space-y-4 mb-12 animate-fadeIn">
              {memoData.map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                  <button
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors duration-200"
                    onClick={() => toggleSection(index)}
                  >
                    <span className="font-semibold text-lg text-slate-700">{item.title}</span>
                    {expandedSections.includes(index) ?
                      <ChevronUp className="h-6 w-6 text-slate-500" /> :
                      <ChevronDown className="h-6 w-6 text-slate-500" />
                    }
                  </button>
                  {expandedSections.includes(index) && (
                    <div className="p-4 sm:p-5 bg-white whitespace-pre-line text-slate-700 border-t border-slate-200 text-sm sm:text-base leading-relaxed">
                      {highlightTextWithGlossary(item.content)}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {activeTab === 'flashcards' && (
            <section className="mb-12 flex flex-col items-center animate-fadeIn">
              <div
                className="relative h-72 w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 mb-6 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ perspective: '1200px' }}
              >
                <div className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
                     style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
                  <div
                    className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-white rounded-2xl shadow-inner"
                    style={{ transform: 'rotateY(0deg)', backfaceVisibility: 'hidden', opacity: isFlipped ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
                  >
                    <p className="text-sm font-medium text-slate-500 mb-3 tracking-wider">QUESTION</p>
                    <p className="text-xl sm:text-2xl font-semibold text-center text-slate-800">{flashcardsData[currentCard].question}</p>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
                      <RefreshCw size={14} className="mr-1" />
                      Cliquez pour tourner
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-white rounded-2xl shadow-inner"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', opacity: isFlipped ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                  >
                    <p className="text-sm font-medium text-slate-500 mb-3 tracking-wider">RÉPONSE</p>
                    <p className="text-xl sm:text-2xl font-semibold text-center text-slate-700">{flashcardsData[currentCard].answer}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center w-full max-w-lg mt-4">
                <button onClick={prevCard} className="p-3 bg-white hover:bg-slate-100 rounded-full transition-colors shadow-md border border-slate-200">
                  <ArrowRight className="h-6 w-6 transform rotate-180 text-slate-600" />
                </button>
                <span className="text-base font-medium text-slate-600">{currentCard + 1} / {flashcardsData.length}</span>
                <button onClick={nextCard} className="p-3 bg-white hover:bg-slate-100 rounded-full transition-colors shadow-md border border-slate-200">
                  <ArrowRight className="h-6 w-6 text-slate-600" />
                </button>
              </div>
            </section>
          )}

          {activeTab === 'quiz' && (
            <section className="mb-12 animate-fadeIn">
              {!quizCompleted ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xl">
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <span className="text-sm sm:text-base text-slate-500">Question {currentQuestion + 1}/{quizQuestionsData.length}</span>
                    <span className="text-sm sm:text-base font-semibold text-slate-700">Score: {score}/{quizQuestionsData.length}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-6 sm:mb-8">{quizQuestionsData[currentQuestion].question}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {quizQuestionsData[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3 sm:p-4 text-left rounded-lg border transition-all duration-200 ease-in-out flex items-center text-sm sm:text-base group
                          ${selectedOption !== null
                            ? index === quizQuestionsData[currentQuestion].answer
                              ? 'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300'
                              : index === selectedOption
                                ? 'bg-red-50 border-red-400 text-red-800 ring-2 ring-red-300'
                                : 'bg-white border-slate-200 text-slate-600 cursor-not-allowed'
                            : 'bg-white border-slate-300 hover:bg-slate-100 hover:border-slate-400 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1'
                          }`}
                      >
                        <span className="mr-3 flex-shrink-0">
                          {selectedOption !== null && index === quizQuestionsData[currentQuestion].answer && (
                            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          )}
                          {selectedOption !== null && index === selectedOption && index !== quizQuestionsData[currentQuestion].answer && (
                            <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                          )}
                           {selectedOption === null && (
                             <span className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-slate-400 group-hover:border-slate-600 rounded-full transition-colors"></span>
                           )}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {selectedOption !== null && (
                    <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-white rounded-lg border border-slate-200 animate-fadeIn">
                      <p className="text-slate-700 text-sm sm:text-base">{quizQuestionsData[currentQuestion].explanation}</p>
                      <button
                        onClick={nextQuestion}
                        className="mt-4 w-full py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
                      >
                        {currentQuestion < quizQuestionsData.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 text-center shadow-xl animate-fadeIn">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-4">Résultats du Quiz</h3>
                  <p className="text-5xl sm:text-6xl font-bold mb-3 text-slate-700">{score}/{quizQuestionsData.length}</p>
                  <p className="text-slate-600 text-base sm:text-lg mb-8">
                    {score === quizQuestionsData.length
                      ? "🏆 Parfait ! Maîtrise excellente du sujet."
                      : score >= quizQuestionsData.length / 2
                        ? "👍 Bon résultat ! Quelques points à revoir."
                        : "📚 À approfondir - Consultez la fiche mémo."}
                  </p>
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === 'kahoot' && (
            <section className="mb-12 p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xl animate-fadeIn">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-800 text-center">Jouer au Quiz Kahoot!</h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-inner border border-slate-300">
                <iframe
                  src="https://kahoot.it/challenge/001115080?challenge-id=ce72474c-f579-45bb-9168-e288af0db70d_1723784845005"
                  title="Quiz Kahoot sur la Candidose Vaginale"
                  className="absolute top-0 left-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-slate-600 mt-4 text-center">
                Si le Kahoot ne se charge pas, vérifiez les permissions de votre navigateur pour le contenu externe.
              </p>
            </section>
          )}

          {activeTab === 'video' && ( // Nouvelle section Vidéo
            <section className="mb-12 p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xl animate-fadeIn">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-slate-800 text-center flex items-center justify-center gap-2">
                <Video className="h-6 w-6 text-red-600" /> Vidéo Explicative : Candidose Vaginale
              </h3>
              <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden shadow-inner border border-slate-300">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/xtMbZ1IbDjM"
                  title="Vidéo YouTube sur la Candidose Vaginale"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-slate-600 mt-4 text-center">
                Cette vidéo offre un complément visuel aux informations présentées dans la fiche mémo.
              </p>
            </section>
          )}

          {activeTab === 'podcast' && (
            <section className="mb-8 p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xl text-center animate-fadeIn">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-slate-800">
                Podcast : Candidose Vaginale
              </h3>
              <audio controls className="w-full max-w-md mx-auto mb-6 rounded-lg shadow">
                <source src="https://pharmaconseilbmb.com/podcast/femme/M%C3%A9mo-candidose-vaginale.mp3" type="audio/mpeg" />
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
              <div className="mt-6 flex justify-center">
                <img
                  src="https://pharmaconseilbmb.com/podcast/femme/candidose-vaginale.jpg"
                  alt="Podcast sur la candidose vaginale"
                  className="w-full max-w-sm h-auto rounded-lg shadow-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/250?grayscale&blur=2'; }}
                />
              </div>
            </section>
          )}
          
          {activeTab === 'glossary' && (
            <section className="mb-12 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xl animate-fadeIn">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-800 flex items-center gap-2">
                Glossaire Médical Interactif <Sparkles className="h-6 w-6 text-amber-500" />
              </h3>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Entrez un terme médical pour une explication claire, ou parcourez les termes déjà définis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={medicalTerm}
                  onChange={(e) => setMedicalTerm(e.target.value)}
                  placeholder="Ex: Dyspareunie, Candida..."
                  className="flex-grow p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleExplainMedicalTerm}
                  disabled={isExplainingTerm || !medicalTerm.trim()}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                >
                  {isExplainingTerm ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>Expliquer</>
                  )}
                </button>
              </div>
              {isLoadingGlossaryTerms && !medicalExplanation && Object.keys(glossaryTerms).length === 0 && (
                 <div className="p-4 bg-white border-slate-200 rounded-lg mt-4 text-center text-slate-600">
                    Chargement des définitions initiales...
                 </div>
              )}
              {medicalExplanation && (
                <div className="p-4 bg-white whitespace-pre-line border border-slate-200 rounded-lg mt-4 text-sm sm:text-base text-slate-700 leading-relaxed animate-fadeInQuick">
                  <h4 className="font-semibold mb-2 text-slate-800">Explication de "{medicalTerm}":</h4>
                  <p>{medicalExplanation}</p>
                </div>
              )}

              {Object.keys(glossaryTerms).length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold mb-4 text-lg text-slate-800">Termes courants définis :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(glossaryTerms)
                      .sort(([termA], [termB]) => termA.localeCompare(termB)) 
                      .map(([term, definition]) => (
                      <div key={term} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-medium capitalize text-slate-700">{term.length > 25 ? `${term.substring(0,25)}...` : term}</p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">{definition.length > 100 ? `${definition.substring(0,100)}...` : definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}

      <footer className="text-center mt-12 text-slate-500 text-xs sm:text-sm py-6 border-t border-slate-200">
        Mémo fiche conseil interactive - PharmaConseil &copy; {new Date().getFullYear()} . Propulsée par l'IA.
      </footer>
    </div>
  );
}
