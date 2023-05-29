import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView, Animated, Easing, Pressable, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//@ts-ignore
import successBg from './assets/success-bg.png';
//@ts-ignore
import successImg from './assets/success-img.png';

const cardsArray = [
  {
    type: '🍕',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: 'rgba(222,67,55, 0.8)'
  },
  {
    type: '🍕',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: 'rgba(222,67,55, 0.8)'
  },
  {
    type: '🍔',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#FDBB32'
  },
  {
    type: '🍔',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#FDBB32'
  },
  {
    type: '🍟',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#6FD2CF'
  },
  {
    type: '🍟',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#6FD2CF'
  },
  {
    type: '🌭',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#E3AED0'
  },
  {
    type: '🌭',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#E3AED0'
  },
  {
    type: '🥪',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#0FA89E'
  },
  {
    type: '🥪',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#0FA89E'
  },
  {
    type: '🌮',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#F1E0B5'
  },
  {
    type: '🌮',
    show: false,
    isMatched: false,
    unmatched: false,
    disabled: false,
    backgroundColor: '#F1E0B5'
  },
  // {
  //   type: '🍣',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#23A884'
  // },
  // {
  //   type: '🍣',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#23A884'
  // },
  // {
  //   type: '🍩',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#F9C1CD'
  // },
  // {
  //   type: '🍩',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#F9C1CD'
  // },
  // {
  //   type: '🍦',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#F9C1CD'
  // },
  // {
  //   type: '🍦',
  //   show: false,
  //   isMatched: false,
  //   unmatched: false,
  //   disabled: false,
  //   backgroundColor: '#F9C1CD'
  // },
]

const shuffle = (inputArray: any[]) => {
  const array = [...inputArray];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const levels = [
  {
    name: 'Easy',
    value: 1
  }
]

// user needs 8 moves to win
export default function App() {
  const [cards, setCards] = useState<any[]>(cardsArray);
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [matchedCardList, setMatchedCardList] = useState<any[]>([]);
  const [clicks, setClicks] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [failedModalVisible, setFailedModalVisible] = useState(false);
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [currentMatchedCardIndices, setCurrentMatchedCardIndices] = useState<number[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [maxMoves, setMaxMoves] = useState<number>(14);



  const animatedValues = useRef(cards.map(() => new Animated.Value(0))).current;


  // on mount, set timer and shuffle cards
  useEffect(() => {
    const fiveMinutes = 60 * 2;
    // startTimer(fiveMinutes);
    // shuffle(cardsArray);
    setCards(cardsArray);
    setClicks(0);
    setMatchedCardList([]);
    setOpenCards([]);
    const initialCards = shuffle([...cardsArray]);
    setCards(initialCards);
    setLevel(1);
    // setMaxMoves(14);

    return () => { };

  }, []);

  useEffect(() => {
    if (showMatchAnimation) {
      const timeout = setTimeout(() => {
        setShowMatchAnimation(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [showMatchAnimation]);

  useEffect(() => {
    // if (openCards.length === 2) {
    //   setClicks(clicks + 1);
    //   if (clicks === maxMoves) {
    //     setFailedModalVisible(true);
    //   }
    // }

    // display failed modal if user has reached max moves
    console.log('====================================');
    console.log('clicks', clicks);
    console.log('maxMoves', maxMoves);
    console.log('====================================');
    if (clicks  >= maxMoves) {
      setFailedModalVisible(true);
      return
    }
  }, [clicks]);


  const displayCard = (cardIndex: number) => {

    if (openCards.includes(cardIndex)) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[cardIndex].show = !updatedCards[cardIndex].show;
    setCards(updatedCards);
    cardsOpen(cardIndex);

    Animated.sequence([
      Animated.timing(animatedValues[cardIndex], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[cardIndex], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

  }



  // if card is clicked, add to openCards array
  const cardsOpen = (cardIndex: number) => {
    const updatedOpenCards = [...openCards, cardIndex];
    setOpenCards(updatedOpenCards);
    // display failed modal if user has reached max moves

    // console.log('====================================');
    // console.log('clicks', clicks);
    // console.log('maxMoves', maxMoves);
    // console.log('====================================');
    // if (clicks  >= maxMoves) {
    //   setFailedModalVisible(true);
    //   return
    // }

    // if two cards are open, check if they match
    if (updatedOpenCards.length === 2) {
      setClicks((prevClicks) => prevClicks + 1);
      const [firstCard, secondCard] = updatedOpenCards.map((index) => cards[index]);
      if (firstCard.type === secondCard.type) {
        matchedCards(...updatedOpenCards);
      } else {
        unmatchedCards(...updatedOpenCards);
      }
    }
  }

  // if cards match, add to matchedCards array
  const matchedCards = (...cardIndices: number[]) => {
    const updatedMatchedCardList = [...matchedCardList, ...cardIndices];
    setMatchedCardList(updatedMatchedCardList);
    setCurrentMatchedCardIndices(cardIndices);

    const updatedCards = cards.map((card, index) => {
      if (cardIndices.includes(index)) {
        return { ...card, isMatched: true, disabled: true };
      } else {
        return card;
      }
    });

    setCards(updatedCards);
    setTimeout(() => { setShowMatchAnimation(true) }, 500);
    setOpenCards([]);

    if (updatedMatchedCardList.length === cards.length) {
      clearInterval(timerInterval);
      setModalVisible(true);
      if (clicks <= maxMoves) {
        if (level < 5) {
          setLevel((prevLevel) => prevLevel + 1);
          switch (level) {
            case 1:
              setMaxMoves(12);
              break;
            case 2:
              setMaxMoves(10);
              break;
            case 3:
              setMaxMoves(8);
              break;
            case 4:
              setMaxMoves(6);
              break;
            default:
              break;
          }
        }
      } else {
        setFailedModalVisible(true);
      }
    }
  };

  // if cards don't match, add to unmatchedCards array
  const unmatchedCards = (...cardIndices: number[]) => {
    setTimeout(() => {
      const updatedCards = cards.map((card, index) => {
        if (cardIndices.includes(index)) {
          return { ...card, unmatched: true, };
        } else {
          return card;
        }
      });

      setCards(updatedCards);
      setOpenCards([]);

      setTimeout(() => {
        const resetCards = updatedCards.map((card, index) => {
          if (cardIndices.includes(index)) {
            return { ...card, unmatched: false, show: false };
          } else {
            return card;
          }
        });

        setCards(resetCards);
      }, 1000);
    }, 500);
  };

  const resetGame = () => {
    const initialCards = shuffle([...cardsArray]);
    const refreshedCards = initialCards.map((card) => ({
      ...card,
      show: false,
      isMatched: false,
      disabled: false,
      unmatched: false,
    }));
    setCards(refreshedCards);
    setLevel(1);
    setMaxMoves(14);
    setClicks(0);
    setModalVisible(false);
    setFailedModalVisible(false);
  }

  // continue game after winning
  const continueGame = () => {
    const initialCards = shuffle([...cardsArray]);
    const refreshedCards = initialCards.map((card) => ({
      ...card,
      show: false,
      isMatched: false,
      disabled: false,
      unmatched: false,
    }));
    setCards(refreshedCards);
    setModalVisible(false);
    setFailedModalVisible(false);
    setClicks(0);
    setMatchedCardList([]);
    setOpenCards([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.title}>Recall rumble</Text>
        <Text style={styles.numMovesText}>You have made {clicks} moves</Text>
        {/* <Text style={styles.numMovesText}>Level {level} Total moves: {maxMoves}</Text> */}
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
      }}>
        <View
          style={{
            width: '40%',
            borderRadius: 20,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          }}>
          <View
            style={{
              width: '21%',
              height: 30,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#4AB920',
              marginRight: 10,
            }}>
            <Ionicons name={'cellular-outline'} color={'white'} size={16} />
          </View>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
          }}>Level: {level}</Text>
        </View>
        <View
          style={{
            width: '50%',
            borderRadius: 20,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          }}>
          <View
            style={{
              width: '20%',
              height: 30,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#0C4E50',
              marginRight: 10,
            }}>
            <Ionicons name={'move-outline'} color={'white'} size={16} />
          </View>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
          }}>Total moves: {maxMoves}</Text>
        </View>
      </View>

      <View style={styles.wrapper}>
        {
          cards.map((card, index) => {
            const activeCard = currentMatchedCardIndices.includes(index);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                ]}
                onPress={() => {
                  displayCard(index);
                }}
                disabled={card.disabled}
              >
                <Animated.View style={[{
                  width: '100%',
                  height: '100%',
                },
                {
                  transform: [
                    {
                      rotateY: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '90deg'],
                      }),
                    },
                  ],
                },
                ]}>
                  <View style={[{
                    borderRadius: 10,
                    backgroundColor: (card.isMatched && showMatchAnimation && activeCard) ? 'green' : card.show ? card.backgroundColor : '#fff',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                  },
                  // card.isMatched && styles.matchedCard, 
                  card.unmatched && styles.unmatchedCard,
                  ]}>
                    {card.show ? (
                      <Text style={{ fontSize: 40 }}>{card.type}</Text>
                    ) : (
                      <Text style={{ fontSize: 40 }}>❓</Text>
                    )}
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )
          })
        }
      </View>

      <View style={{
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
      }}>
        <Pressable onPress={() => resetGame()} style={{
          width: '60%',
          height: 50,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0C4E50',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
          }} >Reset Game</Text>
        </Pressable>
      </View>

      {/* Congratulations Modal */}
      <SuccessModal continueGame={continueGame} modalVisible={modalVisible} clicks={clicks} level={level} setModalVisible={setModalVisible} maxMoves={maxMoves} />

      {/* Failed Modal */}
      <FailedModal continueGame={continueGame} maxMoves={maxMoves} failedModalVisible={failedModalVisible} setFailedModalVisible={setFailedModalVisible} />
    </SafeAreaView>
  );
}

type SuccessModalProps = {
  modalVisible: boolean;
  clicks: number;
  setModalVisible: (value: boolean) => void;
  level: number;
  maxMoves: number;
  continueGame: () => void;
}

export function SuccessModal(props: SuccessModalProps) {
  const { modalVisible, clicks, setModalVisible, level, maxMoves, continueGame } = props;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        // visible={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ImageBackground source={successBg} resizeMode="cover" style={{
              padding: 35,
            }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={successImg} style={{ width: 120, height: 120, }} />
              </View>


              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 20,
              }}>Congratulations! Level {level} completed successfully.</Text>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginVertical: 10,
              }}>You made {clicks} moves.</Text>

              {/* Body */}
              <View style={{
                marginVertical: 20,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 20,
                }}>Next level unlocked!</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 26,
                }}>Level {level + 1} - Maximum moves: {maxMoves}</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 26,
                }}>Good luck!</Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  continueGame();
                }}>
                <Text style={styles.textStyle}>Continue</Text>
              </Pressable>
            </ImageBackground>
          </View>

        </View>

      </Modal>
    </View>
  )
}

type FailedModalProps = {
  failedModalVisible: boolean;
  setFailedModalVisible: (value: boolean) => void;
  maxMoves: number;
  continueGame: () => void;
}

export function FailedModal(props: FailedModalProps) {
  const { failedModalVisible, setFailedModalVisible, maxMoves, continueGame } = props;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={failedModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 20, }]}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
            }}>Oops!</Text>
            {/* Body */}
            <View style={{
              marginVertical: 20,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'normal',
                lineHeight: 20,
              }}>You failed to complete the match within {maxMoves} moves.</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: 'normal',
                lineHeight: 26,
              }}>Please try again.</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setFailedModalVisible(!failedModalVisible);
                continueGame();
              }}>
              <Text style={styles.textStyle}>Try again</Text>
            </Pressable>
          </View>

        </View>

      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#D8DFEA',
    backgroundColor: '#EFF0F4',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'capitalize',
  },

  numMovesText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',

  },

  card: {
    width: '30%',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchedCard: {
    backgroundColor: '#FDBB32', // burger
  },

  unmatchedCard: {
    backgroundColor: 'red',
  },




  /// style for modal

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 0.58,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
