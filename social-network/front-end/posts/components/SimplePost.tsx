/**
 * Composant représentant un post simple dans le feed.
 * 
 * Responsabilités :
 * - Afficher les informations principales du post
 * - Gérer le like (optimistic update)
 * - Ouvrir l’overlay des commentaires
 * 
 * Le composant est volontairement focalisé sur l’affichage
 * et délègue la gestion des commentaires à un composant séparé.
 */
export default function SimplePost({ post }: Props) {

  /**
   * Récupération des informations de l'utilisateur connecté
   * via un contexte global.
   */
  const { profileGeneralInfo } = useLoginContext();

  /**
   * State local des likes.
   * 
   * On initialise à partir des données reçues dans le post.
   * Toute modification doit déclencher un re-render,
   * donc on utilise useState.
   */
  const [likes, setLikes] = useState<number[]>(post.likes);

  /**
   * State contrôlant l’ouverture de l’overlay des commentaires.
   * 
   * Utilisé pour conditionner le rendu du composant CommentsOverlay.
   */
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  /**
   * Valeur dérivée : indique si l’utilisateur courant a déjà liké le post.
   * 
   * On ne stocke PAS cette valeur dans un state,
   * car elle dépend directement de `likes`.
   * Cela évite une duplication de source de vérité.
   */
  const hasLiked = likes.includes(profileGeneralInfo.usr_ID);

  /**
   * Gestion optimiste du like.
   * 
   * On met à jour l’UI immédiatement sans attendre la réponse serveur.
   * L’appel API peut être ajouté ici si nécessaire.
   */
  const handleLike = () => {

    setLikes((prev) =>
      hasLiked
        // Si déjà liké → on retire l’ID utilisateur
        ? prev.filter((id) => id !== profileGeneralInfo.usr_ID)
        // Sinon → on l’ajoute
        : [...prev, profileGeneralInfo.usr_ID]
    );
  };

  return (
    <>
      {/* Conteneur principal du post */}
      <View style={{ marginBottom: 20, paddingBottom: 10 }}>

        {/* HEADER : avatar + identité */}
        <View style={{ flexDirection: "row", marginBottom: 10 }}>

          {/* Avatar utilisateur */}
          <Image
            style={{ width: 50, height: 50, borderRadius: 25 }}
            source={{ uri: post.profilePicture }}
          />

          {/* Nom + alias */}
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "600" }}>
              {post.pseudo}
            </Text>
            <Text style={{ color: "#888" }}>
              @{post.alias}
            </Text>
          </View>
        </View>

        {/* CONTENU TEXTE */}
        <Text style={{ marginBottom: 10 }}>
          {post.text_content}
        </Text>

        {/* Image optionnelle */}
        {post.image_uri && (
          <Image
            style={{ height: 200 }}
            source={{ uri: post.image_uri }}
          />
        )}

        {/* FOOTER : interactions */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >

          {/* LIKE */}
          <TouchableOpacity onPress={handleLike}>
            <Text>
              <FontAwesome5
                name="heart"
                solid={hasLiked}
                size={14}
                color="#00ff7f"
              />
              {" "}
              {likes.length}
            </Text>
          </TouchableOpacity>

          {/* COMMENTAIRES */}
          <TouchableOpacity
            onPress={() => setIsCommentsOpen(true)}
          >
            <Text>
              <FontAwesome5
                name="comment"
                size={14}
                color="#ff00ff"
              />
              {" "}
              {post.comment_count}
            </Text>
          </TouchableOpacity>

          {/* DATE FORMATÉE */}
          <Text style={{ fontSize: 12, color: "#999" }}>
            {formattedTimeAgo(post.post_date)}
          </Text>

        </View>
      </View>

      {/* Overlay des commentaires séparé pour respecter
          le principe de responsabilité unique */}
      <CommentsOverlay
        visible={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        postId={post.post_id}
      />
    </>
  );
}
