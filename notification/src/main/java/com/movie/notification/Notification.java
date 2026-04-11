package com.movie.notification;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * @author DMITRII LEVKIN on 07/10/2024
 * @project MovieReservationSystem
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @SequenceGenerator(
            name = "notification_id_sequence",
            sequenceName = "notification_id_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "notification_id_sequence"
    )
    private Long notificationId;
    private Long toUserId;
    private String toUserEmail;
    private String sender;
    private String message;
    private LocalDateTime sentAt;

    // Default no-args constructor
    public Notification() {
    }

    // All-args constructor
    public Notification(Long notificationId, Long toUserId, String toUserEmail, String sender, String message, LocalDateTime sentAt) {
        this.notificationId = notificationId;
        this.toUserId = toUserId;
        this.toUserEmail = toUserEmail;
        this.sender = sender;
        this.message = message;
        this.sentAt = sentAt;
    }

    // Builder pattern
    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Long notificationId;
        private Long toUserId;
        private String toUserEmail;
        private String sender;
        private String message;
        private LocalDateTime sentAt;

        public NotificationBuilder notificationId(Long notificationId) {
            this.notificationId = notificationId;
            return this;
        }

        public NotificationBuilder toUserId(Long toUserId) {
            this.toUserId = toUserId;
            return this;
        }

        public NotificationBuilder toUserEmail(String toUserEmail) {
            this.toUserEmail = toUserEmail;
            return this;
        }

        public NotificationBuilder sender(String sender) {
            this.sender = sender;
            return this;
        }

        public NotificationBuilder message(String message) {
            this.message = message;
            return this;
        }

        public NotificationBuilder sentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public Notification build() {
            return new Notification(notificationId, toUserId, toUserEmail, sender, message, sentAt);
        }
    }
}
