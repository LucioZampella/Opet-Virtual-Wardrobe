package com.virtualwardrobe.backend.models.preferences;

import com.virtualwardrobe.backend.models.preferences.auxiliar.AttributeType;
import com.virtualwardrobe.backend.models.store.storeListing.StoreListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PreferencesRepositorie extends JpaRepository<UserPreferences, Integer> {

    List<UserPreferences> findByUser_UserId(Integer userId);

    // --> Estas son las preferencias de un usuario filtradas por tipo de atributo
    List<UserPreferences> findByUser_UserIdAndAttributeType(Integer userId, AttributeType attributeType);

    // --> Una preferencia específica (para actualizarla sin duplicar)
    Optional<UserPreferences> findByUser_UserIdAndAttributeTypeAndAttributeId(
            Integer userId,
            AttributeType attributeType,
            Integer attributeId
    );
}
