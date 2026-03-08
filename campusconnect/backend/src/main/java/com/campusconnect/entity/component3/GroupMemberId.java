package com.campusconnect.entity.component3;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class GroupMemberId implements Serializable {

    private Long groupId;
    private Long userId;
}