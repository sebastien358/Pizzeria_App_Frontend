export interface CartProductBaseInterface {
  image: string | null
}

export interface CartProductInterface extends CartProductBaseInterface{
  id: number
}

export interface CartItemInterface extends CartProductBaseInterface {
  //rien à ajouter
}
