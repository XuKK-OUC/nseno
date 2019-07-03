package addons.nsneo.pub;

import com.auth0.jwt.JWTSigner;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.internal.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Yang Liu
 * @Date: 2019/4/23 22:08
 */
public class JWT {
    private static final String SECRET = "89612299D60259815CF3306E61561EFE";

    private static final String EXP = "exp";

    private static final String PAYLOAD = "payload";

    //加密
    public static <T> String sign(T object, long maxAge) {
        try {
            final JWTSigner signer = new JWTSigner(SECRET);
            final Map<String, Object> claims = new HashMap<String, Object>();
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(object);
            claims.put(PAYLOAD, jsonString);
            claims.put(EXP, System.currentTimeMillis() + maxAge);
            return signer.sign(claims);
        } catch(Exception e) {
            return null;
        }
    }

    //解密
    public static<T> T unsign(String jwt, Class<T> classT) {
        final JWTVerifier verifier = new JWTVerifier(SECRET);
        try {
            final Map<String,Object> claims= verifier.verify(jwt);
            if (claims.containsKey(EXP) && claims.containsKey(PAYLOAD)) {
                String json = (String)claims.get(PAYLOAD);
                ObjectMapper objectMapper = new ObjectMapper();
                return objectMapper.readValue(json, classT);

            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
